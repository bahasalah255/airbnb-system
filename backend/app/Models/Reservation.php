<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'apartment_id',
        'client_id',
        'check_in',
        'check_out',
        'status',
        'phone',
        'special_requests',
        'total_price',
    ];

    protected $casts = [
        'check_in' => 'datetime',
        'check_out' => 'datetime',
        'total_price' => 'decimal:2',
    ];

    public function apartment()
    {
        return $this->belongsTo(Apartment::class);
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }
}