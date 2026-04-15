<?php

namespace App\Http\Controllers;

use App\Models\Apartment;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    
    // Créer une réservation
    public function store(Request $request, Apartment $apartment)
    {
        $request->validate([
            'check_in' => 'required|date|after:today',
            'check_out' => 'required|date|after:check_in',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string|min:10'
        ]);
        
        // Vérifier la disponibilité
        if (!$apartment->isAvailableForDates($request->check_in, $request->check_out)) {
            return back()->with('error', 'Ces dates ne sont pas disponibles.');
        }
        
        // Calculer le prix total
        $days = Carbon::parse($request->check_in)->diffInDays(Carbon::parse($request->check_out));
        $totalPrice = $days * $apartment->price_per_night;
        
        // Créer la réservation
        Reservation::create([
            'apartment_id' => $apartment->id,
            'user_id' => Auth::id(),
            'customer_name' => $request->customer_name,
            'customer_email' => $request->customer_email,
            'customer_phone' => $request->customer_phone,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'total_price' => $totalPrice,
            'status' => 'pending'
        ]);
        
        return redirect()->route('dashboard')
            ->with('success', 'Réservation effectuée avec succès ! En attente de confirmation.');
    }
    
    // Afficher les réservations
    public function index()
    {
        $user = Auth::user();
        
        if ($user->isAdmin()) {
            $reservations = Reservation::with(['apartment', 'user'])->latest()->paginate(20);
        } elseif ($user->isOwner()) {
            $apartmentIds = $user->apartments->pluck('id');
            $reservations = Reservation::with('user')
                ->whereIn('apartment_id', $apartmentIds)
                ->latest()
                ->paginate(20);
        } else {
            $reservations = $user->reservations()->with('apartment')->latest()->paginate(20);
        }
        
        return view('reservations.index', compact('reservations'));
    }
    
    // Mettre à jour le statut
    public function updateStatus(Request $request, Reservation $reservation)
    {
        $user = Auth::user();
        
        // Vérifier les droits (admin ou propriétaire de l'appartement)
        if (!$user->isAdmin() && $reservation->apartment->user_id !== $user->id) {
            abort(403);
        }
        
        $request->validate([
            'status' => 'required|in:confirmed,cancelled'
        ]);
        
        $reservation->update(['status' => $request->status]);
        
        $message = $request->status === 'confirmed' 
            ? 'Réservation confirmée !' 
            : 'Réservation annulée.';
        
        return back()->with('success', $message);
    }
    
    // Annuler une réservation (par le client)
    public function destroy(Reservation $reservation)
    {
        if ($reservation->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            abort(403);
        }
        
        if ($reservation->status === 'cancelled') {
            return back()->with('error', 'Cette réservation est déjà annulée.');
        }
        
        $reservation->update(['status' => 'cancelled']);
        
        return back()->with('success', 'Réservation annulée avec succès.');
    }
    
    public function show(Reservation $reservation)
    {
        return view('reservations.show', compact('reservation'));
    }
    
    public function edit(Reservation $reservation)
    {
        abort(404);
    }
    
    public function update(Request $request, Reservation $reservation)
    {
        abort(404);
    }
}