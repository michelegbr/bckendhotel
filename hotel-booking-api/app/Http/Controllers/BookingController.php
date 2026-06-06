<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\AuditLog; // 👈 1. Panggil Model AuditLog di sini
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB; 

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'admin') {
            $bookings = \App\Models\Booking::with('room')->paginate(5); 
        } else {
            $bookings = \App\Models\Booking::with('room')->where('user_id', $user->id)->paginate(5);
        }

        return response()->json($bookings);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'check_in_date' => 'required|date|after_or_equal:today',
            'check_out_date' => 'required|date|after:check_in_date',
        ]);

        // MEMULAI TRANSAKSI
        return DB::transaction(function () use ($request, $validated) {
            
            // 1. KUNCI DATA KAMAR
            $room = Room::lockForUpdate()->find($validated['room_id']);

            if ($room->status === 'maintenance') {
                return response()->json(['success' => false, 'message' => 'Kamar sedang dalam perbaikan.'], 400);
            }

            // 2. BERSIHKAN FORMAT TANGGAL (Hapus jam/menit dari React agar murni YYYY-MM-DD)
            $checkIn = Carbon::parse($validated['check_in_date'])->toDateString();
            $checkOut = Carbon::parse($validated['check_out_date'])->toDateString();

            // 3. LOGIKA OVERLAP ANTI-BOCOR + PENGHANCUR SNAPSHOT
            $isBooked = Booking::where('room_id', $validated['room_id'])
                ->whereIn('status', ['pending', 'confirmed'])
                ->where(function ($query) use ($checkIn, $checkOut) {
                    // Rumus mutlak: Check-in lama harus SEBELUM Check-out baru, 
                    // DAN Check-out lama harus SESUDAH Check-in baru.
                    $query->where('check_in_date', '<', $checkOut)
                          ->where('check_out_date', '>', $checkIn);
                })
                ->lockForUpdate() // <--- KUNCI RAHASIA: Paksa baca data paling real-time, tembus batas snapshot!
                ->exists();

            if ($isBooked) {
                return response()->json(['success' => false, 'message' => 'Kamar sudah dipesan pada tanggal tersebut. Silakan pilih tanggal lain.'], 409);
            }

            // 4. HITUNG HARI DAN HARGA MENGGUNAKAN TANGGAL BERSIH
            $days = Carbon::parse($checkIn)->diffInDays(Carbon::parse($checkOut));
            if ($days == 0) $days = 1; 

            $totalPrice = $days * $room->price_per_night;

            // 5. BUAT BOOKINGNYA
            $booking = Booking::create([
                'user_id' => $request->user()->id, 
                'room_id' => $validated['room_id'],
                'check_in_date' => $checkIn, // Gunakan tanggal yang sudah dibersihkan
                'check_out_date' => $checkOut,
                'total_price' => $totalPrice,
                'status' => 'pending'
            ]);

            // (Kode AuditLog kamu biarkan persis di bawah sini seperti sebelumnya...)
            AuditLog::create([
                'user_id'     => $request->user()->id,
                'action'      => 'CREATE_BOOKING',
                'description' => "User berhasil booking Kamar ID: {$validated['room_id']} untuk tanggal {$checkIn} s/d {$checkOut} (Rp " . number_format($totalPrice, 0, ',', '.') . ")",
                'ip_address'  => $request->ip(),
            ]);

            return response()->json(['success' => true, 'message' => 'Booking berhasil dibuat!', 'data' => $booking], 201);
        });
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $booking = Booking::find($id);
        if (!$booking) return response()->json(['success' => false, 'message' => 'Booking tidak ditemukan'], 404);

        $booking->update(['status' => $validated['status']]);

        // 👈 3. SUNTIKKAN AUDIT LOG UNTUK AKTIVITAS ADMIN
        AuditLog::create([
            'user_id'     => $request->user()->id,
            'action'      => 'UPDATE_BOOKING_STATUS',
            'description' => "Admin mengubah status Booking ID: {$id} menjadi '{$validated['status']}'.",
            'ip_address'  => $request->ip(),
        ]);

        return response()->json(['success' => true, 'message' => 'Status booking diperbarui', 'data' => $booking]);
    }
}