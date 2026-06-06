<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    | Izinkan frontend React (Vite) mengakses API Laravel.
    | Sesuaikan 'allowed_origins' jika port frontend berbeda.
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',   // Vite default port
        'http://127.0.0.1:5173',
        'http://localhost:3000',   // Fallback
        'http://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Penting: false untuk API token-based (Sanctum), bukan session-based
    'supports_credentials' => false,

];
