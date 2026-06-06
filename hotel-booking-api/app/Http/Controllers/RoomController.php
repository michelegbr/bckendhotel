<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::query();

        // Fitur Search yang sudah kamu buat (Sangat Bagus!)
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('room_number', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('room_type', 'like', "%{$search}%"); // Tambahan: bisa cari by tipe kamar
        }

        if ($request->has('room_type')) {
            $query->where('room_type', $request->room_type);
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Limit default diperbesar ke 100 agar di awal React bisa menampilkan semua kamar di dashboard
        $limit = $request->get('limit', 100); 
        
        return response()->json([
            'success' => true,
            'data' => $query->paginate($limit)
        ]);
    }

    public function store(Request $request)
    {
        // room_number diubah jadi nullable karena akan kita buat otomatis
        $validated = $request->validate([
            'room_number' => 'nullable|string|unique:rooms',
            'room_type' => 'required|string',
            'price_per_night' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:available,maintenance',
        ]);

        // 🚀 KUNCI PERBAIKAN: Generate nomor kamar acak (Misal: R-8492) jika kosong
        if (empty($validated['room_number'])) {
            $validated['room_number'] = 'R-' . rand(1000, 9999);
        }

        return response()->json([
            'success' => true,
            'data' => Room::create($validated)
        ], 201);
    }

    public function show($id)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['message' => 'Kamar tidak ditemukan'], 404);
        
        return response()->json(['success' => true, 'data' => $room]);
    }

    public function update(Request $request, $id)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['message' => 'Kamar tidak ditemukan'], 404);

        $validated = $request->validate([
            'room_number' => 'nullable|string|unique:rooms,room_number,' . $id,
            'room_type' => 'string',
            'price_per_night' => 'numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'in:available,maintenance',
        ]);

        $room->update($validated);
        
        return response()->json(['success' => true, 'data' => $room]);
    }

    public function destroy($id)
    {
        $room = Room::find($id);
        if (!$room) return response()->json(['message' => 'Kamar tidak ditemukan'], 404);

        $room->delete();
        
        return response()->json(['success' => true, 'message' => 'Kamar dihapus']);
    }
}