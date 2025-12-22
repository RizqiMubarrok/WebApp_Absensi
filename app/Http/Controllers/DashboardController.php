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
            ]);
        }

        return response()->json([
            'total_students' => $totalStudents,
            'recap' => $recap,
            'classes_count' => $classesCount,
            'last7' => $last7,
        ]);
    }
}
