<?php

use App\Http\Controllers\Api\ApartmentController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientDashboardController;
use App\Http\Controllers\Api\OwnerDashboardController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ReservationController as ApiReservationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'user']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

Route::apiResource('apartments', ApartmentController::class);
Route::get('apartments/{apartment}/availability', [ApartmentController::class, 'availability']);
Route::apiResource('reservations', ApiReservationController::class)->middleware('auth:sanctum');
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/stats', [App\Http\Controllers\AdminController::class, 'stats']);

    Route::get('/admin/overview', [AdminDashboardController::class, 'overview']);
    Route::get('/admin/analytics', [AdminDashboardController::class, 'analytics']);

    Route::get('/admin/users', [AdminDashboardController::class, 'users']);
    Route::get('/admin/users/{user}', [AdminDashboardController::class, 'showUser']);
    Route::put('/admin/users/{user}', [AdminDashboardController::class, 'updateUser']);
    Route::patch('/admin/users/{user}/role', [AdminDashboardController::class, 'updateUserRole']);
    Route::patch('/admin/users/{user}/status', [AdminDashboardController::class, 'updateUserStatus']);
    Route::delete('/admin/users/{user}', [AdminDashboardController::class, 'deleteUser']);

    Route::get('/admin/apartments', [AdminDashboardController::class, 'apartments']);
    Route::post('/admin/apartments', [AdminDashboardController::class, 'storeApartment']);
    Route::get('/admin/apartments/{apartment}', [AdminDashboardController::class, 'showApartment']);
    Route::put('/admin/apartments/{apartment}', [AdminDashboardController::class, 'updateApartment']);
    Route::patch('/admin/apartments/{apartment}/status', [AdminDashboardController::class, 'updateApartmentStatus']);
    Route::delete('/admin/apartments/{apartment}', [AdminDashboardController::class, 'deleteApartment']);

    Route::get('/admin/reservations', [AdminDashboardController::class, 'reservations']);
    Route::get('/admin/reservations/{reservation}', [AdminDashboardController::class, 'showReservation']);
    Route::patch('/admin/reservations/{reservation}/status', [AdminDashboardController::class, 'updateReservationStatus']);
    Route::delete('/admin/reservations/{reservation}', [AdminDashboardController::class, 'deleteReservation']);

    Route::get('/admin/owners', [AdminDashboardController::class, 'owners']);
    Route::get('/admin/owners/{owner}', [AdminDashboardController::class, 'showOwner']);

    Route::get('/admin/notifications', [AdminDashboardController::class, 'notifications']);

    Route::get('/admin/settings', [AdminDashboardController::class, 'settings']);
    Route::put('/admin/settings', [AdminDashboardController::class, 'updateSettings']);
});

Route::middleware(['auth:sanctum', 'owner'])->prefix('owner')->group(function () {
    Route::get('/overview', [OwnerDashboardController::class, 'overview']);

    Route::get('/apartments', [OwnerDashboardController::class, 'apartments']);
    Route::post('/apartments', [OwnerDashboardController::class, 'storeApartment']);
    Route::put('/apartments/{apartment}', [OwnerDashboardController::class, 'updateApartment']);
    Route::delete('/apartments/{apartment}', [OwnerDashboardController::class, 'deleteApartment']);
    Route::patch('/apartments/{apartment}/status', [OwnerDashboardController::class, 'updateApartmentStatus']);

    Route::get('/reservations', [OwnerDashboardController::class, 'reservations']);
    Route::get('/reservations/{reservation}', [OwnerDashboardController::class, 'showReservation']);
    Route::patch('/reservations/{reservation}/status', [OwnerDashboardController::class, 'updateReservationStatus']);

    Route::get('/calendar', [OwnerDashboardController::class, 'calendar']);
    Route::post('/blocked-dates', [OwnerDashboardController::class, 'blockDates']);
    Route::delete('/blocked-dates/{blockedDate}', [OwnerDashboardController::class, 'unblockDates']);

    Route::get('/analytics', [OwnerDashboardController::class, 'analytics']);
    Route::get('/notifications', [OwnerDashboardController::class, 'notifications']);

    Route::get('/profile', [OwnerDashboardController::class, 'profile']);
    Route::put('/profile', [OwnerDashboardController::class, 'updateProfile']);
    Route::put('/password', [OwnerDashboardController::class, 'updatePassword']);
});

Route::middleware(['auth:sanctum', 'client'])->prefix('client')->group(function () {
    Route::get('/overview', [ClientDashboardController::class, 'overview']);

    Route::get('/reservations', [ClientDashboardController::class, 'reservations']);
    Route::get('/reservations/{reservation}', [ClientDashboardController::class, 'showReservation']);
    Route::patch('/reservations/{reservation}/cancel', [ClientDashboardController::class, 'cancelReservation']);

    Route::get('/favorites', [ClientDashboardController::class, 'favorites']);
    Route::post('/favorites', [ClientDashboardController::class, 'addFavorite']);
    Route::delete('/favorites/{apartment}', [ClientDashboardController::class, 'removeFavorite']);

    Route::get('/browse-apartments', [ClientDashboardController::class, 'browseApartments']);
    Route::get('/notifications', [ClientDashboardController::class, 'notifications']);

    Route::get('/profile', [ClientDashboardController::class, 'profile']);
    Route::put('/profile', [ClientDashboardController::class, 'updateProfile']);
    Route::put('/password', [ClientDashboardController::class, 'updatePassword']);
});
