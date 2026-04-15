<?php

namespace Database\Factories;

use App\Models\Apartment;
use App\Models\BlockedDate;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlockedDateFactory extends Factory
{
    protected $model = BlockedDate::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('now', '+60 days');
        $end = $this->faker->dateTimeBetween($start, $start->format('Y-m-d H:i:s') . ' +3 days');

        return [
            'apartment_id' => Apartment::factory(),
            'start_date' => $start,
            'end_date' => $end,
            'reason' => $this->faker->sentence,
        ];
    }
}