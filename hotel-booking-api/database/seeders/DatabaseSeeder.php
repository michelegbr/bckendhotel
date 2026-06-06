<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */

        // 1. BUAT AKUN ADMIN UTAMA (Aman untuk GitHub)
        public function run(): void
    {
        // 1. BUAT AKUN ADMIN UTAMA
        \App\Models\User::factory()->create([
            'name'     => env('ADMIN_NAME', 'Super Admin'),
            'email'    => env('ADMIN_EMAIL', 'admin@staymatch.com'),
            'password' => bcrypt(env('ADMIN_PASSWORD', 'admin123')),
            'role'     => 'admin',
        ]);

        // 2. BUAT AKUN CUSTOMER
        \App\Models\User::factory()->create([
            'name'     => 'Customer Test',
            'email'    => 'customer@staymatch.com',
            'password' => bcrypt('customer123'),
            'role'     => 'customer',
        ]);

        // 3. PANGGIL SEEDER KAMAR YANG BARU KITA BUAT (Tambahkan ini)
        $this->call(RoomSeeder::class);
    }
}