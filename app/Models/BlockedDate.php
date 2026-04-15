<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BlockedDate extends Model
{
    protected $fillable = ['apartment_id', 'start_date', 'end_date', 'reason'];
    
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date'
    ];
    
    public function apartment()
    {
        return $this->belongsTo(Apartment::class);
    }
}