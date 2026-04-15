<?php

namespace Database\Factories;

use App\Models\Apartment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $checkIn = $this->faker->dateTimeBetween('now', '+30 days');
        $checkOut = $this->faker->dateTimeBetween($checkIn, $checkIn->format('Y-m-d H:i:s') . ' +7 days');
        $nights = $checkIn->diff($checkOut)->days;
        $apartment = Apartment::factory()->create();

        return [
            'apartment_id' => $apartment->id,
            'client_id' => User::factory(),
            'check_in' => $checkIn,
            'check_out' => $checkOut,
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
            'phone' => $this->faker->phoneNumber,
            'special_requests' => $this->faker->optional()->sentence,
            'total_price' => $nights * $apartment->price_per_night,
        ];
    }
}