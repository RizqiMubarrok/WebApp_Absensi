<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_saves_attendance_and_ensures_single_record_per_student_per_day()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $students = Student::factory()->count(3)->create();

        $date = now()->format('Y-m-d');

        $records = [];
        foreach ($students as $student) {
            $records[] = ['student_id' => $student->id, 'status' => 'present', 'note' => 'on time'];
        }

        // Duplicate entry for first student to simulate accidental double-post
        $records[] = ['student_id' => $students->first()->id, 'status' => 'absent', 'note' => 'changed mind'];

        $response = $this->post('/attendances', ['date' => $date, 'records' => $records]);

        $response->assertRedirect();

        foreach ($students as $student) {
            $this->assertDatabaseHas('attendances', [
                'student_id' => $student->id,
                'date' => $date,
            ]);
        }

        // ensure only one record exists for first student for that date and status is the last one applied
        $this->assertEquals(1, Attendance::where('student_id', $students->first()->id)->whereDate('date', $date)->count());
        $this->assertDatabaseHas('attendances', [
            'student_id' => $students->first()->id,
            'date' => $date,
            'status' => 'absent',
        ]);
    }
}
