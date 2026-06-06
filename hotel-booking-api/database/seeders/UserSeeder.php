<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User; // Memanggil model User bawaan Laravel
use Illuminate\Support\Facades\Hash; // Untuk mengenkripsi password

class UserSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'name'     => 'Admin Utama',
            'email'    => 'admin@staymatch.id',
            'password' => Hash::make('admin123'), 
        ]);
    }
}