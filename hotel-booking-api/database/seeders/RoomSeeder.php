<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $rooms = [
            [
                'room_number' => 'A-101',
                'room_type' => 'Deluxe Room (Ayana Midplaza)',
                'price_per_night' => 1250000,
                'status' => 'available',
                'description' => '33m² · 1 King Bed · City View. Fasilitas premium termasuk akses rooftop pool dan spa world-class.',
            ],
            [
                'room_number' => 'K-404',
                'room_type' => 'Ocean View Room (The Apurva)',
                'price_per_night' => 3200000,
                'status' => 'available',
                'description' => '48m² · King Bed · Ocean View. Permata Bali di tepi tebing karang menghadap langsung ke Samudra Hindia.',
            ],
            [
                'room_number' => 'H-702',
                'room_type' => 'Superior Room (Grand Hyatt)',
                'price_per_night' => 890000,
                'status' => 'available',
                'description' => '28m² · Twin/King Bed. Lokasi super strategis di pusat bisnis, dekat dengan pusat perbelanjaan utama.',
            ],
            [
                'room_number' => 'P-202',
                'room_type' => 'Valley View Room (Padma Ubud)',
                'price_per_night' => 2100000,
                'status' => 'available',
                'description' => '42m² · King Bed · Valley View. Tersembunyi di lembah Ubud yang hijau, menawarkan ketenangan alam Bali yang autentik.',
            ],
            [
                'room_number' => 'N-612',
                'room_type' => 'Sea View Suite (Novotel Makassar)',
                'price_per_night' => 680000,
                'status' => 'available',
                'description' => '30m² · King Bed · Sea View. Hotel modern tepat di tepi pantai Losari dengan pemandangan Selat Makassar yang memukau.',
            ],
        ];

        foreach ($rooms ?? [] as $room) {
            Room::create($room);
        }
    }
}