<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed branches first
        $this->call([
            BranchSeeder::class,
        ]);

        // Create Admin user
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@funeraria.cl',
            'password' => bcrypt('password'),
            'branch_id' => 1, // Casa Matriz
        ]);

        // Create Secretary user
        User::factory()->create([
            'name' => 'Secretary',
            'email' => 'secretary@funeraria.cl',
            'password' => bcrypt('password'),
            'branch_id' => 1, // Casa Matriz
        ]);

        // Seed staff
        $this->call([
            StaffSeeder::class,
        ]);

        // Seed categories, services and products (inventory)
        $this->call([
            CategorySeeder::class,
            ServiceSeeder::class,
            ProductSeeder::class,
        ]);
    }
}
