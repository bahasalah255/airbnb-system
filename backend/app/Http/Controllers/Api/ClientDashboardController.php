<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\Favorite;
use App\Models\Reservation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ClientDashboardController extends Controller
{
    public function overview(Request $request): JsonResponse
    {
        $clientId = $request->user()->id;

        $reservationsQuery = Reservation::where('client_id', $clientId);
        $totalReservations = (clone $reservationsQuery)->count();
        $upcomingStays = (clone $reservationsQuery)
            ->where('status', 'confirmed')
            ->whereDate('check_in', '>=', now()->toDateString())
            ->count();
        $completedStays = (clone $reservationsQuery)
            ->where('status', 'confirmed')
            ->whereDate('check_out', '<', now()->toDateString())
            ->count();
        $cancelledReservations = (clone $reservationsQuery)->where('status', 'cancelled')->count();
        $totalSpent = (float) (clone $reservationsQuery)->where('status', 'confirmed')->sum('total_price');

        $recentReservations = Reservation::with('apartment:id,name,photos,price_per_night,capacity,address')
            ->where('client_id', $clientId)
            ->latest()
            ->take(8)
            ->get();

        $notifications = Reservation::with('apartment:id,name')
            ->where('client_id', $clientId)
            ->latest()
            ->take(8)
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'type' => $reservation->status === 'cancelled' ? 'cancellation' : 'booking',
                    'title' => "Reservation #{$reservation->id} - {$reservation->apartment?->name}",
                    'status' => $reservation->status,
                    'created_at' => $reservation->created_at,
                ];
            });

        return response()->json([
            'welcome' => [
                'name' => $request->user()->name,
            ],
            'metrics' => [
                'total_reservations' => $totalReservations,
                'upcoming_stays' => $upcomingStays,
                'completed_stays' => $completedStays,
                'cancelled_reservations' => $cancelledReservations,
                'total_spent' => $totalSpent,
            ],
            'recent_reservations' => $recentReservations,
            'notifications' => $notifications,
        ]);
    }

    public function reservations(Request $request): JsonResponse
    {
        $query = Reservation::with('apartment:id,name,photos,address,price_per_night,capacity')
            ->where('client_id', $request->user()->id);

        if ($request->filled('filter')) {
            $filter = $request->string('filter');
            if ($filter === 'upcoming') {
                $query->where('status', 'confirmed')->whereDate('check_in', '>=', now()->toDateString());
            } elseif ($filter === 'completed') {
                $query->where('status', 'confirmed')->whereDate('check_out', '<', now()->toDateString());
            } elseif ($filter === 'cancelled') {
                $query->where('status', 'cancelled');
            }
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('apartment', function ($aq) use ($search) {
                    $aq->where('name', 'like', "%{$search}%")
                        ->orWhere('address', 'like', "%{$search}%");
                })->orWhere('check_in', 'like', "%{$search}%")
                    ->orWhere('check_out', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate((int) $request->integer('per_page', 10)));
    }

    public function showReservation(Request $request, Reservation $reservation): JsonResponse
    {
        $this->authorizeReservation($request, $reservation);

        return response()->json([
            'reservation' => $reservation->load('apartment:id,name,address,photos,price_per_night,capacity'),
        ]);
    }

    public function cancelReservation(Request $request, Reservation $reservation): JsonResponse
    {
        $this->authorizeReservation($request, $reservation);

        if ($reservation->status === 'cancelled') {
            return response()->json([
                'message' => 'Reservation already cancelled.',
            ], 422);
        }

        if ($reservation->check_in <= now()) {
            return response()->json([
                'message' => 'You can no longer cancel this reservation.',
            ], 422);
        }

        $reservation->update([
            'status' => 'cancelled',
        ]);

        return response()->json([
            'message' => 'Reservation cancelled successfully.',
            'reservation' => $reservation,
        ]);
    }

    public function favorites(Request $request): JsonResponse
    {
        $query = Favorite::with('apartment:id,name,address,photos,price_per_night,capacity,is_active')
            ->where('user_id', $request->user()->id)
            ->latest();

        return response()->json($query->paginate((int) $request->integer('per_page', 12)));
    }

    public function addFavorite(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'apartment_id' => ['required', 'exists:apartments,id'],
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'apartment_id' => $validated['apartment_id'],
        ]);

        return response()->json([
            'message' => 'Apartment saved to favorites.',
            'favorite' => $favorite,
        ], 201);
    }

    public function removeFavorite(Request $request, Apartment $apartment): JsonResponse
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('apartment_id', $apartment->id)
            ->delete();

        return response()->json([
            'message' => 'Apartment removed from favorites.',
        ]);
    }

    public function browseApartments(Request $request): JsonResponse
    {
        $query = Apartment::with('owner:id,name,email')
            ->where('is_active', true);

        if ($request->filled('city')) {
            $query->where('address', 'like', '%' . $request->string('city') . '%');
        }

        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', $request->float('max_price'));
        }

        if ($request->filled('capacity')) {
            $query->where('capacity', '>=', $request->integer('capacity'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%");
            });
        }

        return response()->json($query->latest()->paginate((int) $request->integer('per_page', 12)));
    }

    public function notifications(Request $request): JsonResponse
    {
        $notifications = Reservation::with('apartment:id,name')
            ->where('client_id', $request->user()->id)
            ->latest()
            ->take(20)
            ->get()
            ->map(function ($reservation) {
                return [
                    'id' => $reservation->id,
                    'type' => $reservation->status === 'cancelled' ? 'cancellation' : 'booking',
                    'title' => "Reservation update: {$reservation->apartment?->name}",
                    'status' => $reservation->status,
                    'created_at' => $reservation->updated_at,
                ];
            });

        return response()->json([
            'items' => $notifications,
        ]);
    }

    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'profile' => $request->user()->only(['id', 'name', 'email', 'phone', 'role']),
        ]);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:30'],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'profile' => $user->only(['id', 'name', 'email', 'phone', 'role']),
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update([
            'password' => $validated['password'],
        ]);

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }

    private function authorizeReservation(Request $request, Reservation $reservation): void
    {
        if ((int) $reservation->client_id !== (int) $request->user()->id) {
            abort(403, 'Unauthorized reservation access.');
        }
    }
}
