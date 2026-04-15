<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use Illuminate\Http\Request;

class ApartmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Apartment::where('is_active', true);

        // Recherche par nom ou description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('description', 'like', "%$search%");
            });
        }

        // Filtrage par prix max
        if ($request->has('max_price')) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        return response()->json($query->get());
    }

    /**
     * Display a single apartment resource.
     */
    public function show(Apartment $apartment)
    {
        if (! $apartment->is_active) {
            return response()->json([
                'message' => 'Apartment is not available.',
            ], 404);
        }

        return response()->json([
            'apartment' => $apartment->load('owner:id,name,email'),
        ]);
    }

    /**
     * Get availability for an apartment.
     */
    public function availability(Apartment $apartment)
    {
        if (! $apartment->is_active) {
            return response()->json([
                'message' => 'Apartment is not available.',
            ], 404);
        }

        $reservations = $apartment->reservations()
            ->where('status', '!=', 'cancelled')
            ->get(['check_in', 'check_out', 'status']);

        $blockedDates = $apartment->blockedDates()
            ->get(['start_date', 'end_date', 'reason']);

        $events = [];

        foreach ($reservations as $reservation) {
            $events[] = [
                'title' => 'Réservé',
                'start' => $reservation->check_in->toDateString(),
                'end' => $reservation->check_out->addDay()->toDateString(), // FullCalendar end is exclusive
                'color' => 'red',
                'allDay' => true,
                'type' => 'reservation',
                'status' => $reservation->status,
            ];
        }

        foreach ($blockedDates as $blocked) {
            $events[] = [
                'title' => 'Bloqué: ' . $blocked->reason,
                'start' => $blocked->start_date->toDateString(),
                'end' => $blocked->end_date->addDay()->toDateString(),
                'color' => 'gray',
                'allDay' => true,
                'type' => 'blocked',
            ];
        }

        return response()->json($events);
    }
}
