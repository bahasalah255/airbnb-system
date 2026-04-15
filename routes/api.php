<?php

use App\Http\Controllers\Api\ApartmentController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\ReservationController as ApiReservationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('apartments', ApartmentController::class);
Route::get('apartments/{apartment}/availability', [ApartmentController::class, 'availability']);
Route::apiResource('reservations', ApiReservationController::class)->middleware('auth:sanctum');
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/stats', [App\Http\Controllers\AdminController::class, 'stats']);
});
