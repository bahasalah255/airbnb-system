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
        $admin = User::updateOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Admin User',
            'role' => 'admin',
        ]);

        // Create owner user
        $owner = User::updateOrCreate([
            'email' => 'owner@example.com',
        ], [
            'name' => 'Owner User',
            'role' => 'owner',
        ]);

        // Create client user
        $client = User::updateOrCreate([
            'email' => 'client@example.com',
        ], [
            'name' => 'Client User',
            'role' => 'client',
        ]);

        // Create apartments
        $apartmentOne = \App\Models\Apartment::updateOrCreate([
            'name' => 'Appartement Centre-Ville',
        ], [
            'owner_id' => $owner->id,
            'name' => 'Appartement Centre-Ville',
            'address' => '123 Rue de la Ville, Paris',
            'photos' => ['/storage/seed/apartment-1.jpg', '/storage/seed/apartment-2.jpg'],
            'price_per_night' => 100,
            'description' => 'Magnifique appartement en plein centre-ville.',
            'capacity' => 4,
            'is_active' => true,
        ]);

        $apartmentTwo = \App\Models\Apartment::updateOrCreate([
            'name' => 'Studio Montmartre',
        ], [
            'owner_id' => $owner->id,
            'name' => 'Studio Montmartre',
            'address' => '456 Rue Montmartre, Paris',
            'photos' => ['/storage/seed/studio-1.jpg'],
            'price_per_night' => 80,
            'description' => 'Charmant studio avec vue sur la ville.',
            'capacity' => 2,
            'is_active' => true,
        ]);

        // Create reservation
        \App\Models\Reservation::updateOrCreate([
            'apartment_id' => $apartmentOne->id,
            'client_id' => $client->id,
            'check_in' => now()->addDays(10)->toDateString(),
            'check_out' => now()->addDays(15)->toDateString(),
        ], [
            'check_in' => now()->addDays(10),
            'check_out' => now()->addDays(15),
            'status' => 'confirmed',
            'phone' => '0123456789',
            'total_price' => 500,
        ]);

        // Create blocked date
        \App\Models\BlockedDate::updateOrCreate([
            'apartment_id' => $apartmentOne->id,
            'start_date' => now()->addDays(20)->toDateString(),
            'end_date' => now()->addDays(22)->toDateString(),
        ], [
            'apartment_id' => $apartmentOne->id,
            'start_date' => now()->addDays(20),
            'end_date' => now()->addDays(22),
            'reason' => 'Maintenance',
        ]);
    }
}
