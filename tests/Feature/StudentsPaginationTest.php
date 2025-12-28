<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentsPaginationTest extends TestCase
{
    use RefreshDatabase;

    public function test_students_index_pagination_meta_is_correct()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // Create 30 students so there are two full pages with per_page=15
        Student::factory()->count(30)->create();

        $response = $this->get('/students?per_page=15&page=2');

        $response->assertStatus(200);

        // The Inertia payload should include the students meta with current_page, per_page and total
        $response->assertSee('"current_page":2');
        $response->assertSee('"per_page":15');
        $response->assertSee('"total":30');
    }
}
