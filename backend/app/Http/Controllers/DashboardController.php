<?php

namespace App\Http\Controllers;

use App\Models\Apartment;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if ($user->isAdmin()) {
            // Dashboard Admin
            $totalApartments = Apartment::count();
            $totalReservations = Reservation::count();
            $pendingReservations = Reservation::where('status', 'pending')->count();
            $revenue = Reservation::where('status', 'confirmed')->sum('total_price');
            $recentReservations = Reservation::with('apartment')->latest()->take(5)->get();
            
            return view('dashboard.admin', compact(
                'totalApartments', 'totalReservations', 
                'pendingReservations', 'revenue', 'recentReservations'
            ));
        }
        
        if ($user->isOwner()) {
            // Dashboard Propriétaire
            $apartments = $user->apartments;
            $totalApartments = $apartments->count();
            $reservations = Reservation::whereIn('apartment_id', $apartments->pluck('id'))->get();
            $totalReservations = $reservations->count();
            $pendingReservations = $reservations->where('status', 'pending')->count();
            $revenue = $reservations->where('status', 'confirmed')->sum('total_price');
            
            return view('dashboard.owner', compact(
                'apartments', 'totalApartments', 'totalReservations',
                'pendingReservations', 'revenue'
            ));
        }
        
        // Dashboard Client
        $reservations = $user->reservations()->with('apartment')->latest()->get();
        $activeReservations = $reservations->where('status', 'confirmed');
        $pendingReservations = $reservations->where('status', 'pending');
        
        return view('dashboard.client', compact('reservations', 'activeReservations', 'pendingReservations'));
    }
}