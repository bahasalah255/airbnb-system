<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Apartment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json(
            Reservation::with('apartment')
                ->where('client_id', Auth::id())
                ->latest()
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'apartment_id' => 'required|exists:apartments,id',
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'phone' => 'required|string|max:20',
            'special_requests' => 'nullable|string|max:500',
        ]);

        $apartment = Apartment::findOrFail($request->apartment_id);
        if (! $apartment->is_active) {
            return response()->json([
                'message' => 'Cet appartement n\'est pas disponible actuellement.',
            ], 422);
        }

        if (! $apartment->isAvailableForDates($request->check_in, $request->check_out)) {
            return response()->json([
                'message' => 'L\'appartement est déjà réservé pour ces dates.',
            ], 422);
        }

        $nights = (strtotime($request->check_out) - strtotime($request->check_in)) / (60 * 60 * 24);
        $totalPrice = $nights * $apartment->price_per_night;

        $reservation = Reservation::create([
            'client_id' => Auth::id(),
            'apartment_id' => $request->apartment_id,
            'check_in' => $request->check_in,
            'check_out' => $request->check_out,
            'phone' => $request->phone,
            'special_requests' => $request->special_requests,
            'total_price' => $totalPrice,
            'status' => 'pending'
        ]);

        return response()->json($reservation, 201);
    }
}
