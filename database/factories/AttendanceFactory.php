<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class AttendanceFactory extends Factory
{
    protected $model = Attendance::class;

    public function definition()
    {
        return [
            'student_id' => Student::factory(),
            'date' => fake()->dateTimeBetween('-14 days', 'now')->format('Y-m-d'),
            'status' => fake()->randomElement(['present', 'absent', 'sick', 'permit']),
            'note' => fake()->optional()->sentence(),
        ];
    }
}
