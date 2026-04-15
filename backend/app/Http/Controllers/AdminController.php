<?php

namespace App\Http\Controllers;

use App\Models\Apartment;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
    }
    
    public function index()
    {
        $totalApartments = Apartment::count();
        $totalUsers = User::count();
        $totalReservations = Reservation::count();
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $revenue = Reservation::where('status', 'confirmed')->sum('total_price');
        
        $recentReservations = Reservation::with(['apartment', 'client'])
            ->latest()
            ->take(10)
            ->get();
            
        return view('admin.index', compact(
            'totalApartments', 'totalUsers', 'totalReservations',
            'pendingReservations', 'revenue', 'recentReservations'
        ));
    }
    
    public function apartments()
    {
        $apartments = Apartment::with('owner')->latest()->paginate(15);
        return view('admin.apartments', compact('apartments'));
    }
    
    public function reservations()
    {
        $reservations = Reservation::with(['apartment', 'client'])->latest()->paginate(20);
        return view('admin.reservations', compact('reservations'));
    }
    
    public function users()
    {
        $users = User::latest()->paginate(15);
        return view('admin.users', compact('users'));
    }
    
    public function stats()
    {
        return response()->json([
            'apartments' => Apartment::count(),
            'reservations' => Reservation::count(),
            'revenue' => Reservation::where('status', 'confirmed')->sum('total_price'),
            'pending' => Reservation::where('status', 'pending')->count(),
        ]);
    }
}