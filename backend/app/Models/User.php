<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'phone', 'password', 'role', 'is_active'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }
    
    /**
     * Relations
     */
    public function apartments()
    {
        return $this->hasMany(Apartment::class, 'owner_id');
    }
    
    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'client_id');
    }

    public function favorites()
    {
        return $this->belongsToMany(Apartment::class, 'favorites', 'user_id', 'apartment_id')->withTimestamps();
    }
    
    /**
     * Role checks
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
    
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }
    
    public function isClient(): bool
    {
        return $this->role === 'client';
    }
}