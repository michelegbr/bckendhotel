<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\BookingController; 
use App\Models\User;
use App\Models\AuditLog;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);

    // ==========================================
    // 🛡️ ZONA EKSKLUSIF ADMIN
    // Semua rute di dalam ini otomatis dilindungi oleh middleware 'role:admin'
    // ==========================================
    Route::middleware('role:admin')->group(function () {
        // Manajemen Kamar
        Route::post('/rooms', [RoomController::class, 'store']);
        Route::put('/rooms/{id}', [RoomController::class, 'update']);
        Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);
        
        // Manajemen Status Pesanan
        Route::put('/bookings/{id}/status', [BookingController::class, 'updateStatus']);
        
        // 🚀 API Baru untuk Dashboard Statistik Admin
        Route::get('/users', function () {
            // Mengambil semua user, diurutkan dari yang terbaru
            return response()->json(User::orderBy('id', 'desc')->get());
        });

        Route::get('/audit-logs', function () {
            // Mengambil 50 log aktivitas terbaru
            return response()->json(AuditLog::orderBy('created_at', 'desc')->take(50)->get());
        });
    });
});
