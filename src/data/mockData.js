export const HOTELS = [
  { id: 1, name: "Ayana Midplaza Jakarta", city: "Jakarta", location: "Jakarta Pusat", price: 1250000, stars: 5, emoji: "🏨", tag: "Populer", available: true, rating: 4.8, reviews: 312, amenities: ["Kolam Renang", "Free Wifi", "Sarapan", "Spa", "Gym", "Parkir"], desc: "Hotel bintang 5 di jantung Jakarta dengan pemandangan kota yang menakjubkan. Nikmati fasilitas premium termasuk rooftop pool dan spa world-class.", rooms: [{ id: 1, name: "Deluxe Room", desc: "33m² · 1 King Bed · City View", price: 1250000, capacity: 2 }, { id: 2, name: "Executive Suite", desc: "55m² · 1 King Bed · Pool View", price: 1850000, capacity: 2 }, { id: 3, name: "Presidential Suite", desc: "120m² · Living Room · Butler", price: 4500000, capacity: 4 }] },
  { id: 2, name: "The Apurva Kempinski", city: "Bali", location: "Nusa Dua, Bali", price: 3200000, stars: 5, emoji: "🌴", tag: "Bali", available: true, rating: 4.9, reviews: 567, amenities: ["Private Beach", "Free Wifi", "Sarapan", "Infinity Pool", "Spa", "Water Sports"], desc: "Permata Bali di tepi tebing karang menghadap Samudra Hindia. Arsitektur tradisional Bali bertemu kemewahan modern.", rooms: [{ id: 4, name: "Ocean View Room", desc: "48m² · King Bed · Ocean View", price: 3200000, capacity: 2 }, { id: 5, name: "Villa Private Pool", desc: "180m² · Private Pool · Garden", price: 8500000, capacity: 4 }] },
  { id: 3, name: "Grand Hyatt Surabaya", city: "Surabaya", location: "Surabaya, Jawa Timur", price: 890000, stars: 4, emoji: "🏢", tag: "Promo", available: true, rating: 4.5, reviews: 228, amenities: ["Free Wifi", "Gym", "Sarapan", "Rooftop Bar", "Laundry"], desc: "Hotel premium di pusat bisnis Surabaya, lokasi strategis dekat pusat perbelanjaan dan area bisnis utama kota.", rooms: [{ id: 6, name: "Superior Room", desc: "28m² · Twin/King Bed", price: 890000, capacity: 2 }, { id: 7, name: "Deluxe Room", desc: "35m² · King Bed · Pool View", price: 1100000, capacity: 2 }] },
  { id: 4, name: "Padma Resort Ubud", city: "Bali", location: "Ubud, Bali", price: 2100000, stars: 5, emoji: "🌿", tag: "Alam", available: true, rating: 4.9, reviews: 445, amenities: ["Infinity Pool", "Free Wifi", "Sarapan", "Yoga", "Spa", "Nature Walk"], desc: "Tersembunyi di lembah Ubud yang hijau, resort ini menawarkan ketenangan alam Bali yang autentik.", rooms: [{ id: 8, name: "Valley View Room", desc: "42m² · King Bed · Valley View", price: 2100000, capacity: 2 }, { id: 9, name: "Pool Villa", desc: "200m² · Private Pool · Jungle View", price: 5800000, capacity: 4 }] },
  { id: 5, name: "favehotel Bandung", city: "Bandung", location: "Bandung, Jawa Barat", price: 350000, stars: 3, emoji: "⛰️", tag: "Budget", available: false, rating: 4.1, reviews: 134, amenities: ["Free Wifi", "Parkir", "AC", "TV Kabel"], desc: "Hotel nyaman dengan harga terjangkau di kawasan strategis Bandung.", rooms: [{ id: 10, name: "Standard Room", desc: "22m² · Twin Bed", price: 350000, capacity: 2 }, { id: 11, name: "Superior Room", desc: "26m² · King Bed", price: 420000, capacity: 2 }] },
  { id: 6, name: "Novotel Makassar", city: "Makassar", location: "Makassar, Sulawesi", price: 680000, stars: 4, emoji: "🌊", tag: "Timur", available: true, rating: 4.4, reviews: 189, amenities: ["Free Wifi", "Kolam Renang", "Sarapan", "Gym", "Restoran"], desc: "Hotel modern di tepi pantai Losari dengan view Selat Makassar yang memukau.", rooms: [{ id: 12, name: "Deluxe Room", desc: "30m² · King Bed · Sea View", price: 680000, capacity: 2 }, { id: 13, name: "Sea View Suite", desc: "60m² · Living Area · Sea View", price: 1200000, capacity: 4 }] },
  { id: 7, name: "Sheraton Yogyakarta", city: "Yogyakarta", location: "Yogyakarta", price: 780000, stars: 4, emoji: "🏛️", tag: "Budaya", available: true, rating: 4.6, reviews: 298, amenities: ["Free Wifi", "Kolam Renang", "Sarapan", "Cultural Tour", "Spa"], desc: "Hotel heritage di dekat Malioboro dengan sentuhan budaya Jawa yang kuat.", rooms: [{ id: 14, name: "Deluxe Room", desc: "32m² · King/Twin Bed", price: 780000, capacity: 2 }, { id: 15, name: "Kraton Suite", desc: "75m² · Batik Decor · Courtyard View", price: 1600000, capacity: 4 }] },
  { id: 8, name: "Alila Manggis Lombok", city: "Lombok", location: "Lombok, NTB", price: 1890000, stars: 5, emoji: "🐚", tag: "Eksotis", available: true, rating: 4.8, reviews: 201, amenities: ["Private Beach", "Free Wifi", "Snorkeling", "Sunset Cruise", "Spa"], desc: "Resor eksklusif tersembunyi di tepi pantai berpasir putih Lombok.", rooms: [{ id: 16, name: "Beachfront Bungalow", desc: "55m² · King Bed · Beach Access", price: 1890000, capacity: 2 }, { id: 17, name: "Overwater Villa", desc: "90m² · Private Jetty · Sea View", price: 3900000, capacity: 2 }] },
];

export const BOOKINGS_INIT = [
  { id: "STM-2024-0001", userId: 2, hotelId: 1, hotelName: "Ayana Midplaza Jakarta", roomName: "Deluxe Room", guestName: "Budi Santoso", email: "budi@email.com", checkIn: "2024-07-10", checkOut: "2024-07-12", nights: 2, total: 2620000, status: "confirmed", createdAt: "2024-06-28" },
  { id: "STM-2024-0002", userId: 3, hotelId: 2, hotelName: "The Apurva Kempinski", roomName: "Ocean View Room", guestName: "Sari Dewi", email: "sari@email.com", checkIn: "2024-07-15", checkOut: "2024-07-18", nights: 3, total: 9720000, status: "pending", createdAt: "2024-06-29" },
  { id: "STM-2024-0003", userId: 2, hotelId: 4, hotelName: "Padma Resort Ubud", roomName: "Valley View Room", guestName: "Budi Santoso", email: "budi@email.com", checkIn: "2024-08-01", checkOut: "2024-08-04", nights: 3, total: 6420000, status: "confirmed", createdAt: "2024-07-01" },
  { id: "STM-2024-0004", userId: 4, hotelId: 3, hotelName: "Grand Hyatt Surabaya", roomName: "Superior Room", guestName: "Andi Firmansyah", email: "andi@email.com", checkIn: "2024-06-20", checkOut: "2024-06-22", nights: 2, total: 1900000, status: "completed", createdAt: "2024-06-15" },
  { id: "STM-2024-0005", userId: 5, hotelId: 6, hotelName: "Novotel Makassar", roomName: "Sea View Suite", guestName: "Rina Kusuma", email: "rina@email.com", checkIn: "2024-07-20", checkOut: "2024-07-22", nights: 2, total: 2520000, status: "cancelled", createdAt: "2024-07-02" },
];

export const USERS_INIT = [
  { id: 1, name: "Admin Utama", email: "admin@staymatch.id", role: "admin", joined: "2024-01-01", bookings: 0 },
  { id: 2, name: "Budi Santoso", email: "budi@email.com", role: "user", joined: "2024-03-12", bookings: 2 },
  { id: 3, name: "Sari Dewi", email: "sari@email.com", role: "user", joined: "2024-04-05", bookings: 1 },
  { id: 4, name: "Andi Firmansyah", email: "andi@email.com", role: "user", joined: "2024-05-18", bookings: 1 },
  { id: 5, name: "Rina Kusuma", email: "rina@email.com", role: "user", joined: "2024-06-01", bookings: 1 },
];

export const ICONS = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  hotel: "M3 9.5V21h18V9.5M1 9.5L12 2l11 7.5 M9 21v-6h6v6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  booking: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2 M9 5a2 2 0 002 2h2a2 2 0 002-2 M9 5a2 2 0 012-2h2a2 2 0 012 2 M12 12h.01 M12 16h.01 M8 12h.01 M8 16h.01 M16 12h.01",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0",
  plus: "M12 5v14M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  arrow_left: "M19 12H5M12 19l-7-7 7-7",
  menu: "M3 12h18M3 6h18M3 18h18",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
};

export const fmt = (n) => "Rp " + Number(n).toLocaleString("id-ID");
export const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);