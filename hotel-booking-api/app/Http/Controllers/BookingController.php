<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'admin') {
            $bookings = Booking::with('room')->get(); 
        } else {
            $bookings = Booking::with('room')->where('user_id', $user->id)->get(); // Customer lihat miliknya
        }

        return response()->json(['success' => true, 'data' => $bookings]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
        ]);

        $room = Room::find($validated['room_id']);

        if ($room->status === 'maintenance') {
            return response()->json(['success' => false, 'message' => 'Kamar sedang dalam perbaikan.'], 400);
        }

        $isBooked = Booking::where('room_id', $validated['room_id'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('check_in_date', [$validated['check_in_date'], $validated['check_out_date']])
                      ->orWhereBetween('check_out_date', [$validated['check_in_date'], $validated['check_out_date']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('check_in_date', '<=', $validated['check_in_date'])
                            ->where('check_out_date', '>=', $validated['check_out_date']);
                      });
            })->exists();

        if ($isBooked) {
            return response()->json(['success' => false, 'message' => 'Kamar sudah dipesan pada tanggal tersebut. Silakan pilih tanggal lain.'], 409);
        }

        $checkIn = Carbon::parse($validated['check_in_date']);
        $checkOut = Carbon::parse($validated['check_out_date']);
        $days = $checkIn->diffInDays($checkOut);
        
        if ($days == 0) $days = 1; 

        $totalPrice = $days * $room->price_per_night;

        $booking = Booking::create([
            'user_id' => $request->user()->id, // Otomatis memakai ID user yang sedang login
            'room_id' => $validated['room_id'],
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'],
            'total_price' => $totalPrice,
            'status' => 'pending'
        ]);

        return response()->json(['success' => true, 'message' => 'Booking berhasil dibuat!', 'data' => $booking], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $booking = Booking::find($id);
        if (!$booking) return response()->json(['success' => false, 'message' => 'Booking tidak ditemukan'], 404);

        $booking->update(['status' => $validated['status']]);

        return response()->json(['success' => true, 'message' => 'Status booking diperbarui', 'data' => $booking]);
    }
}