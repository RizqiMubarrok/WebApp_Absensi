<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();
        if ($students->isEmpty()) {
            Student::factory()->count(30)->create();
            $students = Student::all();
        }

        $dates = collect(range(0, 14))->map(fn($d) => now()->subDays($d)->format('Y-m-d'));

        foreach ($dates as $date) {
            foreach ($students as $student) {
                // random attendance, only some records to simulate absent data
                if (rand(0, 100) > 10) {
                    Attendance::factory()->create([
                        'student_id' => $student->id,
                        'date' => $date,
                    ]);
                }
            }
        }
    }
}
