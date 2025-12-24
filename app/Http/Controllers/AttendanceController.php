<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $query = Attendance::with('student');

        if ($q = $request->query('q')) {
            $query->whereHas('student', fn($s) => $s->where('name', 'like', "%{$q}%"));
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($date = $request->query('date')) {
            $query->whereDate('date', $date);
        }

        // support filtering attendances by student class (rekap) — uses `class` query param
        $classFilter = $request->query('class');
        if ($classFilter) {
            $query->whereHas('student', fn($s) => $s->where('class', $classFilter));
        }

        // support filtering the marking UI by class via `student_class` param (this does NOT affect the rekap table)
        $studentClass = $request->query('student_class');

        // By default show as many rows as there are students so the table isn't limited to 15.
        // Also allow `?per_page=all` to return every attendance row.
        $studentsCount = Student::count();
        $perPageQuery = $request->query('per_page');

        if ($perPageQuery === 'all') {
            // return a simple array shape that matches `attendances.data` used by the frontend
            $attendances = ['data' => $query->orderByDesc('date')->get()->toArray()];
        } else {
            $perPage = (int) ($perPageQuery ?? $studentsCount ?: 15);
            $attendances = $query->orderByDesc('date')->paginate($perPage)->withQueryString();
        }

        // provide classes list for class selector
        $classes = Student::select('class')->distinct()->whereNotNull('class')->orderBy('class')->pluck('class');

        // provide student list for attendance marking UI (filtered by student_class if requested)
        $students = Student::when($studentClass, fn($q) => $q->where('class', $studentClass))->orderBy('name')->get();

        // detect if the requested recap date is a Sunday (school holiday)
        $isHoliday = false;
        if ($date) {
            try {
                $isHoliday = Carbon::parse($date)->isSunday();
            } catch (\Exception $e) {
                $isHoliday = false;
            }
        }

        // determine if the marking form's date is a holiday (defaults to today if not provided)
        $markingDate = $request->query('date', now()->format('Y-m-d'));
        $marking_is_holiday = false;
        try {
            $marking_is_holiday = Carbon::parse($markingDate)->isSunday();
        } catch (\Exception $e) {
            $marking_is_holiday = false;
        }

        return Inertia::render('Attendances/Index', [
            'attendances' => $attendances,
            'students' => $students,
            'classes' => $classes,
            'filters' => $request->only(['q', 'status', 'date', 'per_page', 'class', 'student_class']),
            'is_holiday' => $isHoliday,
            'marking_is_holiday' => $marking_is_holiday,
        ]);
    }

    /**
     * Bulk upsert attendance for a given date.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'date' => 'required|date',
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.status' => 'required|in:present,absent,sick,permit',
            'records.*.note' => 'nullable|string',
        ]);

        $date = $data['date'];

        // Prevent marking on Sundays (school holiday)
        try {
            if (Carbon::parse($date)->isSunday()) {
                return Redirect::route('attendances.index', ['date' => $date])->with('error', 'Sekolah libur. Absensi tidak dapat dilakukan pada hari Minggu.');
            }
        } catch (\Exception $e) {
            // if parsing fails, allow processing to continue
        }

        foreach ($data['records'] as $rec) {
            Attendance::updateOrCreate(
                ['student_id' => $rec['student_id'], 'date' => $date],
                ['status' => $rec['status'], 'note' => $rec['note'] ?? null]
            );
        }

        return Redirect::route('attendances.index')->with('success', 'Attendance saved.');
    }
}
