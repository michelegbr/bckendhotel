<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog; // 👈 1. Panggil Model AuditLog di sini
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:users',
            'password'              => 'required|string|min:8|confirmed',
            'role'                  => 'nullable|in:admin,customer',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'] ?? 'customer',
        ]);

        // 👈 2. CATAT AKTIVITAS REGISTER
        AuditLog::create([
            'user_id'     => $user->id,
            'action'      => 'REGISTER',
            'description' => "Pengguna baru terdaftar dengan nama: {$user->name} ({$user->role})",
            'ip_address'  => $request->ip(),
        ]);

        // Langsung buat token setelah register
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success'      => true,
            'message'      => 'Registrasi berhasil',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        // Hapus token lama (opsional, biar tidak numpuk)
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        // 👈 3. CATAT AKTIVITAS LOGIN
        AuditLog::create([
            'user_id'     => $user->id,
            'action'      => 'LOGIN',
            'description' => "User berhasil login ke dalam sistem.",
            'ip_address'  => $request->ip(),
        ]);

        return response()->json([
            'success'      => true,
            'message'      => 'Login berhasil',
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'role'         => $user->role,
            'user'         => [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        // 👈 4. CATAT AKTIVITAS LOGOUT (Suntikkan sebelum token dihapus)
        AuditLog::create([
            'user_id'     => $request->user()->id,
            'action'      => 'LOGOUT',
            'description' => "User keluar dari aplikasi secara aman.",
            'ip_address'  => $request->ip(),
        ]);

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout',
        ]);
    }
}