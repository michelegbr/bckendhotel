<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuditLog extends Model
{
    use HasFactory;

    // Mengizinkan Laravel untuk mengisi kolom-kolom ini
    protected $fillable = [
        'user_id', 
        'action', 
        'description', 
        'ip_address'
    ];

    // Surat pengenalan relasi ke tabel users
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}