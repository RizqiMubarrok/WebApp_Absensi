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
}
