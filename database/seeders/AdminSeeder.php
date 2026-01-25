<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            ['email' => 'admin01@example.com', 'name' => 'admin', 'password' => '87654321'],
            ['email' => 'admin1@example.com', 'name' => 'admin', 'password' => '87654321'],
            ['email' => 'admin2@example.com', 'name' => 'admin', 'password' => '87654321'],
            ['email' => 'admin3@example.com', 'name' => 'admin', 'password' => '87654321'],
        ];

        foreach ($admins as $a) {
            $email = $a['email'];
            $name = $a['name'];
            $password = $a['password'];

            $user = User::where('email', $email)->first();

            if ($user) {
                $user->update([
                    'name' => $name,
                    'password' => Hash::make($password),
                    'email_verified_at' => now(),
                ]);

                $this->command->info("Updated existing admin user: {$email}");
            } else {
                User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => Hash::make($password),
                    'email_verified_at' => now(),
                ]);

                $this->command->info("Created admin user: {$email}");
            }
        }

        $this->command->info("AdminSeeder completed.");
    }
}
