<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StudentFactory extends Factory
{
    protected $model = Student::class;

    public function definition()
    {
        return [
            'nis' => fake()->unique()->numerify('NIS####'),
            'name' => fake()->name(),
            'gender' => fake()->randomElement(['male','female']),
            'email' => (fake()->boolean(80) ? fake()->unique()->safeEmail() : null),
            'class' => fake()->randomElement(['X-A', 'X-B', 'XI-A', 'XI-B', 'XII-A']),
            'phone' => (fake()->boolean(60) ? fake()->phoneNumber() : null),
            'address' => (fake()->boolean(50) ? fake()->address() : null),
        ];
    }
}
