<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Apartment;
use App\Models\BlockedDate;
use App\Models\Reservation;
use App\Services\ApartmentPhotoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class OwnerDashboardController extends Controller
{
    public function __construct(private readonly ApartmentPhotoService $photoService)
    {
    }

    public function overview(Request $request): JsonResponse
    {
        $ownerId = $request->user()->id;
        $apartmentIds = Apartment::where('owner_id', $ownerId)->pluck('id');

        $totalApartments = $apartmentIds->count();
        $reservationsQuery = Reservation::whereIn('apartment_id', $apartmentIds);

        $totalReservations = (clone $reservationsQuery)->count();
        $pendingReservations = (clone $reservationsQuery)->where('status', 'pending')->count();
        $confirmedReservations = (clone $reservationsQuery)->where('status', 'confirmed')->count();

        $monthlyRevenue = (float) Reservation::whereIn('apartment_id', $apartmentIds)
            ->where('status', 'confirmed')
            ->whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])
            ->sum('total_price');

        $bookedNights = (float) Reservation::whereIn('apartment_id', $apartmentIds)
            ->where('status', 'confirmed')
            ->selectRaw('COALESCE(SUM(DATEDIFF(check_out, check_in)), 0) as nights')
            ->value('nights');

        $availableNights = max(1, Apartment::where('owner_id', $ownerId)->where('is_active', true)->count() * 365);
        $occupancyRate = round(($bookedNights / $availableNights) * 100, 2);

        $recentReservations = Reservation::with(['client:id,name,email', 'apartment:id,name'])
            ->whereIn('apartment_id', $apartmentIds)
            ->latest()
            ->take(8)
            ->get();

        return response()->json([
            'metrics' => [
                'total_apartments' => $totalApartments,
                'total_reservations' => $totalReservations,
                'pending_reservations' => $pendingReservations,
                'confirmed_reservations' => $confirmedReservations,
                'monthly_revenue' => $monthlyRevenue,
                'occupancy_rate' => $occupancyRate,
            ],
            'recent_reservations' => $recentReservations,
            'notifications' => $this->buildNotifications($ownerId, 8),
        ]);
    }

    public function apartments(Request $request): JsonResponse
    {
        $query = Apartment::where('owner_id', $request->user()->id);

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('is_active', $request->string('status') === 'active');
        }

        if ($request->filled('city')) {
            $query->where('address', 'like', '%' . $request->string('city') . '%');
        }

        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', $request->float('max_price'));
        }

        return response()->json($query->latest()->paginate((int) $request->integer('per_page', 10)));
    }

    public function storeApartment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'kept_photos' => ['nullable', 'array'],
            'kept_photos.*' => ['string', 'max:2048'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'description' => ['required', 'string'],
            'capacity' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
        ]);

        $validated['photos'] = $this->photoService->resolvePhotos($request);

        $validated['owner_id'] = $request->user()->id;

        $apartment = Apartment::create($validated);

        return response()->json([
            'message' => 'Apartment created successfully.',
            'apartment' => $apartment,
        ], 201);
    }

    public function updateApartment(Request $request, Apartment $apartment): JsonResponse
    {
        $this->authorizeApartment($request, $apartment);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string'],
            'photos' => ['nullable', 'array'],
            'photos.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            'kept_photos' => ['nullable', 'array'],
            'kept_photos.*' => ['string', 'max:2048'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'description' => ['required', 'string'],
            'capacity' => ['required', 'integer', 'min:1'],
            'is_active' => ['required', 'boolean'],
        ]);

        $validated['photos'] = $this->photoService->resolvePhotos($request, $apartment);

        $apartment->update($validated);

        return response()->json([
            'message' => 'Apartment updated successfully.',
            'apartment' => $apartment,
        ]);
    }

    public function deleteApartment(Request $request, Apartment $apartment): JsonResponse
    {
        $this->authorizeApartment($request, $apartment);
        $apartment->delete();

        return response()->json([
            'message' => 'Apartment deleted successfully.',
        ]);
    }

    public function updateApartmentStatus(Request $request, Apartment $apartment): JsonResponse
    {
        $this->authorizeApartment($request, $apartment);

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
        ]);

        $apartment->update($validated);

        return response()->json([
            'message' => 'Status updated successfully.',
            'apartment' => $apartment,
        ]);
    }

    public function reservations(Request $request): JsonResponse
    {
        $ownerId = $request->user()->id;

        $query = Reservation::with(['client:id,name,email,phone', 'apartment:id,name,owner_id'])
            ->whereHas('apartment', function ($q) use ($ownerId) {
                $q->where('owner_id', $ownerId);
            });

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->whereHas('client', function ($cq) use ($search) {
                    $cq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                })->orWhereHas('apartment', function ($aq) use ($search) {
                    $aq->where('name', 'like', "%{$search}%");
                });
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        return response()->json($query->latest()->paginate((int) $request->integer('per_page', 10)));
    }

    public function showReservation(Request $request, Reservation $reservation): JsonResponse
    {
        $this->authorizeReservation($request, $reservation);

        return response()->json([
            'reservation' => $reservation->load(['client:id,name,email,phone', 'apartment:id,name,address']),
        ]);
    }

    public function updateReservationStatus(Request $request, Reservation $reservation): JsonResponse
    {
        $this->authorizeReservation($request, $reservation);

        $validated = $request->validate([
            'status' => ['required', 'in:confirmed,cancelled'],
        ]);

        $reservation->update($validated);

        return response()->json([
            'message' => 'Reservation status updated.',
            'reservation' => $reservation,
        ]);
    }

    public function calendar(Request $request): JsonResponse
    {
        $ownerId = $request->user()->id;

        $apartments = Apartment::where('owner_id', $ownerId)
            ->orderBy('name')
            ->get(['id', 'name']);

        $apartmentId = $request->integer('apartment_id');
        if ($apartmentId && ! $apartments->pluck('id')->contains($apartmentId)) {
            abort(403, 'Unauthorized apartment access.');
        }

        $reservationQuery = Reservation::whereIn('apartment_id', $apartments->pluck('id'))
            ->where('status', '!=', 'cancelled');

        $blockedQuery = BlockedDate::whereIn('apartment_id', $apartments->pluck('id'));

        if ($apartmentId) {
            $reservationQuery->where('apartment_id', $apartmentId);
            $blockedQuery->where('apartment_id', $apartmentId);
        }

        $reservationEvents = $reservationQuery->get()->map(function ($reservation) {
            return [
                'id' => 'reservation-' . $reservation->id,
                'resourceId' => $reservation->apartment_id,
                'title' => 'Reserved',
                'start' => Carbon::parse($reservation->check_in)->toDateString(),
                'end' => Carbon::parse($reservation->check_out)->addDay()->toDateString(),
                'allDay' => true,
                'backgroundColor' => '#2563eb',
                'borderColor' => '#2563eb',
                'extendedProps' => [
                    'type' => 'reservation',
                    'reservation_id' => $reservation->id,
                    'status' => $reservation->status,
                ],
            ];
        });

        $blockedEvents = $blockedQuery->get()->map(function ($blockedDate) {
            return [
                'id' => 'blocked-' . $blockedDate->id,
                'resourceId' => $blockedDate->apartment_id,
                'title' => 'Blocked: ' . ($blockedDate->reason ?? 'Unavailable'),
                'start' => Carbon::parse($blockedDate->start_date)->toDateString(),
                'end' => Carbon::parse($blockedDate->end_date)->addDay()->toDateString(),
                'allDay' => true,
                'backgroundColor' => '#ef4444',
                'borderColor' => '#ef4444',
                'extendedProps' => [
                    'type' => 'blocked',
                    'blocked_id' => $blockedDate->id,
                    'reason' => $blockedDate->reason,
                ],
            ];
        });

        return response()->json([
            'apartments' => $apartments,
            'events' => $reservationEvents->concat($blockedEvents)->values(),
        ]);
    }

    public function blockDates(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'apartment_id' => ['required', 'exists:apartments,id'],
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $apartment = Apartment::findOrFail($validated['apartment_id']);
        $this->authorizeApartment($request, $apartment);

        $blockedDate = BlockedDate::create($validated);

        return response()->json([
            'message' => 'Dates blocked successfully.',
            'blocked_date' => $blockedDate,
        ], 201);
    }

    public function unblockDates(Request $request, BlockedDate $blockedDate): JsonResponse
    {
        $this->authorizeApartment($request, $blockedDate->apartment);
        $blockedDate->delete();

        return response()->json([
            'message' => 'Blocked dates removed successfully.',
        ]);
    }

    public function analytics(Request $request): JsonResponse
    {
        $ownerId = $request->user()->id;

        $reservationsPerMonth = Reservation::query()
            ->join('apartments', 'reservations.apartment_id', '=', 'apartments.id')
            ->where('apartments.owner_id', $ownerId)
            ->selectRaw("DATE_FORMAT(reservations.created_at, '%Y-%m') as period")
            ->selectRaw('COUNT(reservations.id) as total')
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $revenuePerMonth = Reservation::query()
            ->join('apartments', 'reservations.apartment_id', '=', 'apartments.id')
            ->where('apartments.owner_id', $ownerId)
            ->where('reservations.status', 'confirmed')
            ->selectRaw("DATE_FORMAT(reservations.created_at, '%Y-%m') as period")
            ->selectRaw('COALESCE(SUM(reservations.total_price), 0) as total')
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $topApartment = Apartment::query()
            ->leftJoin('reservations', 'apartments.id', '=', 'reservations.apartment_id')
            ->where('apartments.owner_id', $ownerId)
            ->selectRaw('apartments.id, apartments.name, COUNT(reservations.id) as reservations_count')
            ->groupBy('apartments.id', 'apartments.name')
            ->orderByDesc('reservations_count')
            ->first();

        $bookedNights = (float) Reservation::query()
            ->join('apartments', 'reservations.apartment_id', '=', 'apartments.id')
            ->where('apartments.owner_id', $ownerId)
            ->where('reservations.status', 'confirmed')
            ->selectRaw('COALESCE(SUM(DATEDIFF(reservations.check_out, reservations.check_in)), 0) as nights')
            ->value('nights');

        $availableNights = max(1, Apartment::where('owner_id', $ownerId)->where('is_active', true)->count() * 365);

        return response()->json([
            'revenue_per_month' => $revenuePerMonth,
            'reservations_per_month' => $reservationsPerMonth,
            'occupancy_rate' => round(($bookedNights / $availableNights) * 100, 2),
            'most_booked_apartment' => $topApartment,
        ]);
    }

    public function notifications(Request $request): JsonResponse
    {
        return response()->json([
            'items' => $this->buildNotifications($request->user()->id, 20),
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

    private function buildNotifications(int $ownerId, int $limit): array
    {
        $apartmentIds = Apartment::where('owner_id', $ownerId)->pluck('id');

        $recentReservations = Reservation::with(['client:id,name', 'apartment:id,name'])
            ->whereIn('apartment_id', $apartmentIds)
            ->latest()
            ->take($limit)
            ->get();

        return $recentReservations->map(function ($reservation) {
            $type = $reservation->status === 'cancelled' ? 'cancellation' : 'booking';
            return [
                'id' => $reservation->id,
                'type' => $type,
                'title' => "{$reservation->client?->name} - {$reservation->apartment?->name}",
                'status' => $reservation->status,
                'created_at' => $reservation->created_at,
            ];
        })->all();
    }

    private function authorizeApartment(Request $request, Apartment $apartment): void
    {
        if ((int) $apartment->owner_id !== (int) $request->user()->id) {
            abort(403, 'Unauthorized apartment access.');
        }
    }

    private function authorizeReservation(Request $request, Reservation $reservation): void
    {
        $isOwnerReservation = Apartment::where('id', $reservation->apartment_id)
            ->where('owner_id', $request->user()->id)
            ->exists();

        if (! $isOwnerReservation) {
            abort(403, 'Unauthorized reservation access.');
        }
    }
}
