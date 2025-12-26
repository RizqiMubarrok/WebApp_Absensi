<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        // provide classes list early so we can default table filters to the first available class
        $classes = Student::select('class')->distinct()->whereNotNull('class')->orderBy('class')->pluck('class');
        $classFilter = $request->query('class');
        if (!$classFilter && $classes->isNotEmpty()) {
            $classFilter = $classes->first();
        }

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
        if ($classFilter) {
            $query->whereHas('student', fn($s) => $s->where('class', $classFilter));
        }

        // support filtering the marking UI by class via `student_class` param (this does NOT affect the rekap table)
        $studentClass = $request->query('student_class');
        if (!$studentClass && $classes->isNotEmpty()) {
            // default the marking UI to the first available class so the attendance input table shows that class by default
            $studentClass = $classes->first();
        }

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

        // provide student list for attendance marking UI (filtered by student_class if requested)
        $students = Student::when($studentClass, fn($q) => $q->where('class', $studentClass))->orderBy('name')->get();

        // provide classes list for class selector (already computed earlier)
        // (kept here for clarity of the return payload)
        $classes = $classes ?? Student::select('class')->distinct()->whereNotNull('class')->orderBy('class')->pluck('class');

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

        $filters = $request->only(['q', 'status', 'date', 'per_page', 'class', 'student_class']);
        if (empty($filters['student_class']) && $studentClass) {
            $filters['student_class'] = $studentClass;
        }
        if (empty($filters['class']) && $classFilter) {
            $filters['class'] = $classFilter;
        }

        return Inertia::render('Attendances/Index', [
            'attendances' => $attendances,
            'students' => $students,
            'classes' => $classes,
            'filters' => $filters,
            'is_holiday' => $isHoliday,
            'marking_is_holiday' => $marking_is_holiday,
        ]);
    }

    /**
     * Helper to build monthly recaps and excluded dates
     */
    private function buildMonthlyRekap(string $month, ?string $class = null): array
    {
        try {
            $start = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        } catch (\Exception $e) {
            $start = now()->startOfMonth();
            $month = $start->format('Y-m');
        }
        $end = $start->copy()->endOfMonth();

        $startDate = $start->format('Y-m-d');
        $endDate = $end->format('Y-m-d');

        // collect Sundays in the month so they can be excluded from counts
        $sundays = [];
        $dd = $start->copy();
        while ($dd->lte($end)) {
            if ($dd->isSunday()) {
                $sundays[] = $dd->format('Y-m-d');
            }
            $dd->addDay();
        }

        // aggregate attendances by student and status for the month (exclude Sundays)
        $attendanceQuery = Attendance::whereBetween('date', [$startDate, $endDate]);
        if (!empty($sundays)) {
            $attendanceQuery->whereNotIn('date', $sundays);
        }

        $counts = $attendanceQuery
            ->select('student_id', 'status', DB::raw('count(*) as total'))
            ->groupBy('student_id', 'status')
            ->get();

        $students = Student::when($class, fn($q) => $q->where('class', $class))->orderBy('name')->get();

        // prepare a map of student_id => totals
        $map = [];
        foreach ($students as $s) {
            $map[$s->id] = [
                'id' => $s->id,
                'name' => $s->name,
                'nis' => $s->nis,
                'class' => $s->class,
                'present' => 0,
                'permit' => 0,
                'absent' => 0,
                'sick' => 0,
            ];
        }

        foreach ($counts as $c) {
            if (!isset($map[$c->student_id])) continue;
            $status = $c->status;
            $map[$c->student_id][$status] = (int) $c->total;
        }

        // compute totals per student (hadir + izin + alfa + sakit)
        foreach ($map as $id => $row) {
            $map[$id]['total'] = ($row['present'] ?? 0) + ($row['permit'] ?? 0) + ($row['absent'] ?? 0) + ($row['sick'] ?? 0);
        }

        $rekapData = array_values($map);

        return [$month, $rekapData, $sundays];
    }

    /**
     * Monthly attendance recap per student
     */
    public function rekap(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        $class = $request->query('class');
        list($month, $rekapData, $sundays) = $this->buildMonthlyRekap($month, $class);

        // provide classes list for class selector
        $classes = Student::select('class')->distinct()->whereNotNull('class')->orderBy('class')->pluck('class');

        return Inertia::render('Attendances/Rekap', [
            'rekapMonth' => $month,
            'rekapData' => $rekapData,
            'excluded_dates' => $sundays,
            'classes' => $classes,
            'selected_class' => $class,
        ]);
    }

    /**
     * Export monthly recap as CSV
     */
    public function rekapExport(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        $class = $request->query('class');
        list($month, $rekapData, $sundays) = $this->buildMonthlyRekap($month, $class);

        $filename = "rekapan-{$month}" . ($class ? "-{$class}" : "") . ".csv";

        $callback = function () use ($rekapData) {
            $out = fopen('php://output', 'w');
            // BOM for Excel compatibility
            fprintf($out, "\xEF\xBB\xBF");
            fputcsv($out, ['NIS', 'Nama', 'Kelas', 'Hadir', 'Izin', 'Sakit', 'Alfa', 'Total']);

            foreach ($rekapData as $r) {
                fputcsv($out, [
                    $r['nis'] ?? '',
                    $r['name'] ?? '',
                    $r['class'] ?? '',
                    $r['present'] ?? 0,
                    $r['permit'] ?? 0,
                    $r['sick'] ?? 0,
                    $r['absent'] ?? 0,
                    $r['total'] ?? 0,
                ]);
            }

            fclose($out);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }

    /**
     * Print-friendly page for monthly recap
     */
    public function rekapPrint(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        $class = $request->query('class');
        list($month, $rekapData, $sundays) = $this->buildMonthlyRekap($month, $class);

        return Inertia::render('Attendances/RekapPrint', [
            'rekapMonth' => $month,
            'rekapData' => $rekapData,
            'excluded_dates' => $sundays,
        ]);
    }

    /**
     * Return distinct class list (JSON) for client-side selection
     */
    public function classes(Request $request)
    {
        $classes = Student::select('class')->distinct()->whereNotNull('class')->orderBy('class')->pluck('class');
        return response()->json($classes);
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
