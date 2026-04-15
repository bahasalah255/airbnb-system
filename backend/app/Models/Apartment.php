<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Apartment extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id', 'name', 'address', 'photos',
        'price_per_night', 'description', 'capacity', 'is_active'
    ];

    protected $casts = [
        'photos' => 'array',
        'is_active' => 'boolean',
    ];

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

    public function blockedDates()
    {
        return $this->hasMany(BlockedDate::class);
    }

    public function favoritedBy()
    {
        return $this->belongsToMany(User::class, 'favorites', 'apartment_id', 'user_id')->withTimestamps();
    }

    public function isAvailableForDates($checkIn, $checkOut)
    {
        $reservationExists = $this->reservations()
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->whereBetween('check_in', [$checkIn, $checkOut])
                  ->orWhereBetween('check_out', [$checkIn, $checkOut])
                  ->orWhere(function ($q) use ($checkIn, $checkOut) {
                      $q->where('check_in', '<=', $checkIn)
                        ->where('check_out', '>=', $checkOut);
                  });
            })
            ->exists();

        if ($reservationExists) {
            return false;
        }

        $blockedExists = $this->blockedDates()
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->whereBetween('start_date', [$checkIn, $checkOut])
                  ->orWhereBetween('end_date', [$checkIn, $checkOut])
                  ->orWhere(function ($q) use ($checkIn, $checkOut) {
                      $q->where('start_date', '<=', $checkIn)
                        ->where('end_date', '>=', $checkOut);
                  });
            })
            ->exists();

        return !$blockedExists;
    }
}