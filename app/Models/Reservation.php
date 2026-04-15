<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'apartment_id', 'client_id', 'check_in', 'check_out', 'status', 'phone', 'special_requests', 'total_price'
    ];
    
    protected $casts = [
        'check_in' => 'date',
        'check_out' => 'date'
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