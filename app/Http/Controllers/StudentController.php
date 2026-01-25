<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::query();

        if ($q = $request->query('q')) {
            $query->where(fn($q2) => $q2->where('name', 'like', "%{$q}%")->orWhere('nis', 'like', "%{$q}%"));
        }

        if ($class = $request->query('class')) {
            $query->where('class', $class);
        }

        $perPage = (int) $request->query('per_page', 15);
        $students = $query->orderBy('name')->paginate($perPage)->withQueryString();

        // get normalized (trimmed) distinct class list and totals
        $classes = DB::table('students')
            ->whereNotNull('class')
            ->where('class', '<>', '')
            ->select(DB::raw('TRIM(class) as class'))
            ->distinct()
            ->orderBy('class')
            ->pluck('class');

        // totals for dashboard cards
        $totalStudents = Student::count();
        $totalClasses = DB::table('students')
            ->whereNotNull('class')
            ->where('class', '<>', '')
            ->select(DB::raw('TRIM(class) as class'))
            ->distinct()
            ->count('class');

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => $request->only(['q', 'class', 'per_page']),
            'classes' => $classes,
            'total_students' => $totalStudents,
            'total_classes' => $totalClasses,
        ]);
    }

    public function create()
    {
        return Inertia::render('Students/Create');
    }

    public function store(Request $request)
    {
        $attrs = $request->validate([
            'nis' => 'required|string|unique:students,nis',
            'name' => 'required|string|max:255',
            'gender' => 'nullable|in:male,female',
            'email' => 'nullable|email|unique:students,email',
            'class' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        Student::create($attrs);

        return Redirect::route('students.index')->with('success', 'Student created.');
    }

    public function show(Student $student)
    {
        return Inertia::render('Students/Show', ['student' => $student]);
    }

    public function edit(Student $student)
    {
        return Inertia::render('Students/Edit', ['student' => $student]);
    }

    public function update(Request $request, Student $student)
    {
        $attrs = $request->validate([
            'nis' => "required|string|unique:students,nis,{$student->id}",
            'name' => 'required|string|max:255',
            'gender' => 'nullable|in:male,female',
            'email' => "nullable|email|unique:students,email,{$student->id}",
            'class' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
        ]);

        $student->update($attrs);

        return Redirect::route('students.index')->with('success', 'Student updated.');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return Redirect::route('students.index')->with('success', 'Student deleted.');
    }

    /**
     * Import students from uploaded CSV file.
     * Expected header row: nis,name,gender,class,phone,address,email
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        if (($handle = fopen($path, 'r')) === false) {
            return Redirect::route('students.index')->with('error', 'Tidak dapat membuka file.');
        }

        $header = null;
        $created = $updated = $skipped = 0;
        $errors = [];
        $rowNumber = 0;

        while (($row = fgetcsv($handle, 0, ',')) !== false) {
            $rowNumber++;
            if ($rowNumber === 1) {
                // normalize header keys to lowercase trimmed
                $header = array_map(fn($h) => strtolower(trim($h)), $row);
                continue;
            }

            if (!$header || count($row) !== count($header)) {
                $errors[] = "Baris {$rowNumber}: jumlah kolom tidak sesuai.";
                $skipped++;
                continue;
            }

            $data = array_combine($header, $row);
            $nis = trim($data['nis'] ?? $data['nisn'] ?? '');
            $name = trim($data['name'] ?? '');

            if (!$nis || !$name) {
                $skipped++;
                continue;
            }

            $attrs = [
                'nis' => $nis,
                'name' => $name,
                'gender' => in_array(strtolower($data['gender'] ?? ''), ['male', 'female']) ? strtolower($data['gender']) : null,
                'email' => !empty($data['email'] ?? '') ? $data['email'] : null,
                'class' => trim($data['class'] ?? ''),
                'phone' => !empty($data['phone'] ?? '') ? $data['phone'] : null,
                'address' => !empty($data['address'] ?? '') ? $data['address'] : null,
            ];

            try {
                $existing = Student::where('nis', $nis)->first();
                if ($existing) {
                    $existing->update($attrs);
                    $updated++;
                } else {
                    Student::create($attrs);
                    $created++;
                }
            } catch (\Exception $e) {
                $errors[] = "Baris {$rowNumber} (NIS: {$nis}): " . $e->getMessage();
            }
        }

        fclose($handle);

        $message = "Import selesai. Dibuat: {$created}. Diupdate: {$updated}. Dilewati: {$skipped}.";

        return Redirect::route('students.index')->with('success', $message)->with('import_errors', $errors);
    }

    /**
     * Download a small CSV template for imports.
     */
    public function importTemplate()
    {
        $csv = "nis,name,gender,class,phone,address,email\n";
        $csv .= "12345,John Doe,male,10A,08123456789,Jl. Contoh,john@example.com\n";

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="students-template.csv"',
        ]);
    }
}
