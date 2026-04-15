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
        // Create admin user
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Create owner user
        User::factory()->create([
            'name' => 'Owner User',
            'email' => 'owner@example.com',
            'role' => 'owner',
        ]);

        // Create client user
        User::factory()->create([
            'name' => 'Client User',
            'email' => 'client@example.com',
            'role' => 'client',
        ]);

        // Create apartments
        \App\Models\Apartment::factory()->create([
            'owner_id' => 2, // owner
            'name' => 'Appartement Centre-Ville',
            'address' => '123 Rue de la Ville, Paris',
            'photos' => json_encode(['photo1.jpg', 'photo2.jpg']),
            'price_per_night' => 100,
            'description' => 'Magnifique appartement en plein centre-ville.',
            'capacity' => 4,
            'is_active' => true,
        ]);

        \App\Models\Apartment::factory()->create([
            'owner_id' => 2,
            'name' => 'Studio Montmartre',
            'address' => '456 Rue Montmartre, Paris',
            'photos' => json_encode(['studio1.jpg']),
            'price_per_night' => 80,
            'description' => 'Charmant studio avec vue sur la ville.',
            'capacity' => 2,
            'is_active' => true,
        ]);

        // Create reservation
        \App\Models\Reservation::factory()->create([
            'apartment_id' => 1,
            'client_id' => 3,
            'check_in' => now()->addDays(10),
            'check_out' => now()->addDays(15),
            'status' => 'confirmed',
            'phone' => '0123456789',
            'total_price' => 500,
        ]);

        // Create blocked date
        \App\Models\BlockedDate::factory()->create([
            'apartment_id' => 1,
            'start_date' => now()->addDays(20),
            'end_date' => now()->addDays(22),
            'reason' => 'Maintenance',
        ]);
    }
}
