<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class DashboardStatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_monthly_stats_span_entire_month()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/dashboard/stats');

        $response->assertStatus(200);

        $payload = $response->json();

        $this->assertArrayHasKey('month', $payload);

        $daysInMonth = Carbon::now()->daysInMonth;

        $this->assertCount($daysInMonth, $payload['month']);

        // Ensure first entry is the 1st of month and last is the last day
        $this->assertStringContainsString(Carbon::now()->startOfMonth()->format('Y-m-d'), $payload['month'][0]['date']);
        $this->assertStringContainsString(Carbon::now()->endOfMonth()->format('Y-m-d'), $payload['month'][$daysInMonth - 1]['date']);
    }
}
