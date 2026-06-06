<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    // Ini kode bawaanmu, tetap kita pertahankan agar aman saat insert data
    protected $fillable = [
        'user_id',
        'room_id',
        'check_in_date',
        'check_out_date',
        'total_price',
        'status',
    ];

    // 1. SURAT PENGENALAN KE TABEL ROOMS
    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    // 2. SURAT PENGENALAN KE TABEL USERS 
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}