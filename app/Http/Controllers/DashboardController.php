<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $today = now()->format('Y-m-d');

        $totalStudents = Student::count();

        $recap = Attendance::whereDate('date', $today)
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        // number of distinct classes
        $classesCount = Student::select('class')->distinct()->whereNotNull('class')->count();

        // per-class attendance stats for today (percentage of students with attendance recorded and status counts)
        $classStats = [];
        $classes = Student::select('class')->distinct()->whereNotNull('class')->where('class', '<>', '')->orderBy('class')->pluck('class');
        foreach ($classes as $class) {
            $totalStudentsInClass = Student::where('class', $class)->count();

            $counts = Attendance::whereDate('date', $today)
                ->whereHas('student', fn($q) => $q->where('class', $class))
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray();

            $present = $counts['present'] ?? 0;
            $permit = $counts['permit'] ?? 0;
            $absent = $counts['absent'] ?? 0;
            $sick = $counts['sick'] ?? 0;

            $marked = $present + $permit + $absent + $sick;
            $percent = $totalStudentsInClass ? (int) round($marked / $totalStudentsInClass * 100) : 0;

            $classStats[] = [
                'class' => $class,
                'total_students' => $totalStudentsInClass,
                'marked' => $marked,
                'percent' => $percent,
                'present' => $present,
                'permit' => $permit,
                'absent' => $absent,
                'sick' => $sick,
            ];
        }

        // last 7 days breakdown by status
        $last7 = collect();
        for ($i = 6; $i >= 0; $i--) {
            $d = now()->subDays($i)->format('Y-m-d');

            $counts = Attendance::whereDate('date', $d)
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray();

            $last7->push([
                'date' => $d,
                'present' => $counts['present'] ?? 0,
                'permit' => $counts['permit'] ?? 0,
                'absent' => $counts['absent'] ?? 0,
                'sick' => $counts['sick'] ?? 0,
                'is_holiday' => \Carbon\Carbon::parse($d)->isSunday(),
            ]);
        }

        // monthly breakdown from the 1st of this month up to today
        $month = collect();
        $start = now()->startOfMonth();
        $end = now();
        $d = $start->copy();
        while ($d->lte($end)) {
            $date = $d->format('Y-m-d');

            $counts = Attendance::whereDate('date', $date)
                ->selectRaw('status, count(*) as total')
                ->groupBy('status')
                ->pluck('total', 'status')
                ->toArray();

            $month->push([
                'date' => $date,
                'present' => $counts['present'] ?? 0,
                'permit' => $counts['permit'] ?? 0,
                'absent' => $counts['absent'] ?? 0,
                'sick' => $counts['sick'] ?? 0,
                'is_holiday' => \Carbon\Carbon::parse($date)->isSunday(),
            ]);

            $d->addDay();
        }

        return response()->json([
            'total_students' => $totalStudents,
            'recap' => $recap,
            'classes_count' => $classesCount,
            'class_stats' => $classStats,
            'last7' => $last7,
            'month' => $month,
        ]);
    }
}
