import { useState, useEffect } from "react";
import { ICONS, fmt } from "../data/mockData";
import { Icon, StatusBadge, HotelCard } from "../components/Shared";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Tambahkan props 'hotels' yang dikirim dari App.jsx
export function PageHome({ hotels = [], onNavigate }) {
  const [dest, setDest] = useState("");
  const cities = ["Semua", "Jakarta", "Bali", "Surabaya", "Yogyakarta", "Bandung", "Makassar", "Lombok"];
  const [city, setCity] = useState("Semua");
  
  // Fitur pencarian filter kota dari data asli
  const filtered = hotels.filter(h => city === "Semua" || h.city === city).slice(0, 4);

  return (
    <div className="page-enter">
      <div className="hero">
        <div className="hero-chip">Hotel Booking Terpercaya</div>
        <h1>Temukan kamar <em>sempurna</em><br />untuk perjalananmu</h1>
        <p>Ribuan pilihan kamar di seluruh Indonesia. Harga terbaik, konfirmasi instan.</p>
        <div className="searchbox">
          <input className="searchbox-field" placeholder="Kota atau tipe kamar..." value={dest} onChange={e => setDest(e.target.value)} />
          <div className="searchbox-div" />
          <input className="searchbox-field" type="date" style={{ maxWidth: 130 }} />
          <div className="searchbox-div" />
          <input className="searchbox-field" type="date" style={{ maxWidth: 130 }} />
          <div className="searchbox-div" />
          <select className="searchbox-field" style={{ maxWidth: 100 }}>
            {["1 tamu", "2 tamu", "3 tamu", "4+"].map(o => <option key={o}>{o}</option>)}
          </select>
          <button className="btn btn-primary" onClick={() => onNavigate("search")}>Cari Kamar</button>
        </div>
      </div>

      <div className="features-strip">
        {[["🛡️", "Terjamin Aman", "Kamar terverifikasi langsung"], ["⚡", "Konfirmasi Instan", "Booking terkonfirmasi seketika"], ["🏷️", "Harga Terbaik", "Garansi harga terbaik"], ["🎧", "Support 24/7", "Tim siap membantu kapan saja"]].map(([ic, t, d]) => (
          <div className="feature-item" key={t}>
            <div className="feature-icon">{ic}</div>
            <h3>{t}</h3>
            <p>{d}</p>
          </div>
        ))}
      </div>

      <div className="section">
        <div className="section-header">
          <div>
            <div className="section-title">Kamar Tersedia</div>
            <div className="section-sub">Daftar kamar langsung dari database StayMatch</div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => onNavigate("search")}>Lihat Semua</button>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div className="chips">
            {cities.map(c => <button key={c} className={`chip ${city === c ? "active" : ""}`} onClick={() => setCity(c)}>{c}</button>)}
          </div>
        </div>
        
        {/* Loading state sederhana jika data dari App.jsx belum masuk */}
        {hotels.length === 0 ? (
           <div style={{ textAlign: "center", padding: "40px", color: "var(--g400)" }}>
             Mengambil data dari server...
           </div>
        ) : (
          <div className="grid-4">
            {filtered.map(h => <HotelCard key={h.id} hotel={h} onClick={() => onNavigate("detail", h)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// Tambahkan props 'hotels' yang dikirim dari App.jsx
export function PageSearch({ hotels = [], onNavigate }) {
  const [query, setQuery] = useState("");
  const [starF, setStarF] = useState(0);
  const [sort, setSort] = useState("popular");
  const [amenF, setAmenF] = useState([]);
  const allAmens = ["Kolam Renang", "Free Wifi", "Sarapan", "Spa", "Gym", "Private Beach"];
  const toggleAmen = (a) => setAmenF(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a]);

  // Gunakan props 'hotels' alih-alih DUMMY_HOTELS
  let resultList = hotels.filter(h => {
    if (query && !h.name.toLowerCase().includes(query.toLowerCase()) && !h.location.toLowerCase().includes(query.toLowerCase())) return false;
    if (starF && h.stars !== starF) return false;
    // Pengecekan aman jika amenities undefined dari database
    if (amenF.length && (!h.amenities || !amenF.every(a => h.amenities.includes(a)))) return false;
    return true;
  });

  if (sort === "price_asc") resultList = [...resultList].sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") resultList = [...resultList].sort((a, b) => b.price - a.price);
  else if (sort === "rating") resultList = [...resultList].sort((a, b) => b.rating - a.rating);

  return (
    <div className="page-enter">
      <div style={{ padding: "20px 24px 0", borderBottom: "1px solid var(--g100)", background: "var(--g50)" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
            <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", color: "var(--g400)" }}><Icon d={ICONS.search} size={14} /></span>
            <input className="form-input" placeholder="Cari hotel atau kota..." value={query} onChange={e => setQuery(e.target.value)} style={{ paddingLeft: 32 }} />
          </div>
          <select className="form-input" style={{ maxWidth: 160 }} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="popular">Terpopuler</option>
            <option value="price_asc">Harga Terendah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="rating">Rating Terbaik</option>
          </select>
        </div>
        <div className="chips" style={{ paddingBottom: 14 }}>
          {[1, 2, 3, 4, 5].map(s => <button key={s} className={`chip ${starF === s ? "active" : ""}`} onClick={() => setStarF(starF === s ? 0 : s)}>{"★".repeat(s)}</button>)}
          {allAmens.map(a => <button key={a} className={`chip ${amenF.includes(a) ? "active" : ""}`} onClick={() => toggleAmen(a)}>{a}</button>)}
        </div>
      </div>
      <div className="section">
        <div style={{ marginBottom: 16, fontSize: 13, color: "var(--g600)" }}>Menampilkan <strong style={{ color: "var(--black)" }}>{resultList.length}</strong> hotel</div>
        {resultList.length === 0 ? (
          <div className="empty"><div className="empty-icon">🔍</div><p>Tidak ada hotel yang sesuai filter.</p></div>
        ) : (
          <div className="grid-4">
            {resultList.map(h => <HotelCard key={h.id} hotel={h} onClick={() => onNavigate("detail", h)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

export function PageDetail({ hotel, onNavigate, user, onNeedLogin }) {
  const [selRoom, setSelRoom] = useState(null);
  if (!hotel) return null;
  const handleSelect = (room) => {
    if (!user) { onNeedLogin(); return; }
    setSelRoom(room);
    onNavigate("booking", { hotel, room });
  };
  return (
    <div className="page-enter">
      <div className="detail-hero">
        <span style={{ fontSize: 64 }}>{hotel.emoji}</span>
        <button className="detail-back" onClick={() => onNavigate("search")}>
          <Icon d={ICONS.arrow_left} size={13} /> Kembali
        </button>
      </div>
      <div style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, fontWeight: 500, marginBottom: 5 }}>{hotel.name}</h2>
            <div style={{ fontSize: 13, color: "var(--g600)", marginBottom: 8 }}>📍 {hotel.location}</div>
            <div style={{ fontSize: 13 }}>{"★".repeat(hotel.stars)}{"☆".repeat(5 - hotel.stars)} <span style={{ color: "var(--g600)", marginLeft: 6 }}>{hotel.rating} · {hotel.reviews} ulasan</span></div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 500 }}>{fmt(hotel.price)}</div>
            <div style={{ fontSize: 12, color: "var(--g600)" }}>mulai dari / malam</div>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
          {hotel.amenities && hotel.amenities.map(a => <span key={a} className="amenity-tag">{a}</span>)}
        </div>
        <p style={{ fontSize: 13, color: "var(--g600)", lineHeight: 1.75, marginBottom: 26 }}>{hotel.desc}</p>
        <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 1, color: "var(--g600)", marginBottom: 14, fontWeight: 500 }}>Pilih Tipe Kamar</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {hotel.rooms && hotel.rooms.map(r => (
            <div key={r.id} className="room-card">
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{r.name}</div>
                <div style={{ fontSize: 12, color: "var(--g600)" }}>{r.desc}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{fmt(r.price)}</div>
                  <div style={{ fontSize: 11, color: "var(--g600)" }}>per malam</div>
                </div>
                <button className="btn btn-primary btn-sm" onClick={() => handleSelect(r)}>Pilih</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageBooking({ booking, onNavigate, onConfirm }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", cin: "", cout: "", note: "", payment: "bank" });
  const [nights, setNights] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const { hotel, room } = booking || {};
  
  useEffect(() => {
    if (form.cin && form.cout) {
      const start = new Date(form.cin);
      const end = new Date(form.cout);
      if (end > start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setNights(diffDays);
      }
    }
  }, [form.cin, form.cout]);

  if (!hotel || !room) return null;
  
  const total = room.price * nights + 120000;
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePay = async () => {
    if (!form.name || !form.email) return;
    setIsLoading(true);

    const payload = {
        user_id: 1, 
        room_id: room.id,
        check_in_date: form.cin,
        check_out_date: form.cout,
        total_price: total,
        status: "pending" 
    };

    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/bookings`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            console.error("Error API Booking:", data);
            alert(data.message || "Maaf, transaksi gagal diproses.");
            setIsLoading(false);
            return; 
        }

        const bookingId = data.data?.id || data.id; 
        
        onConfirm({
            id: bookingId,
            hotelName: hotel.name,
            roomName: room.name,
            guestName: form.name,
            email: form.email,
            checkIn: payload.check_in_date,
            checkOut: payload.check_out_date,
            total: total,
            status: "pending" 
        });
        
        onNavigate("confirm");

    } catch (error) {
        console.error("Fatal Error:", error);
        alert("Terjadi kesalahan jaringan. Gagal terhubung ke server.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="page-enter">
      <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--g100)", display: "flex", alignItems: "center", gap: 12 }}>
        <button className="btn btn-outline btn-sm" onClick={() => onNavigate("detail", hotel)}><Icon d={ICONS.arrow_left} size={13} /></button>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>Isi Data Pemesanan</div>
          <div style={{ fontSize: 12, color: "var(--g600)" }}>Langkah terakhir sebelum konfirmasi</div>
        </div>
      </div>
      <div className="booking-layout">
        <div>
          <div className="booking-section">
            <div className="section-label">Data Tamu</div>
            <div className="form-group"><label className="form-label">Nama Lengkap</label><input className="form-input" placeholder="Sesuai KTP/Paspor" value={form.name} onChange={e => upd("name", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="kamu@email.com" value={form.email} onChange={e => upd("email", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">No. Telepon</label><input className="form-input" placeholder="+62 812 xxxx xxxx" value={form.phone} onChange={e => upd("phone", e.target.value)} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Check-in</label><input className="form-input" type="date" value={form.cin} onChange={e => upd("cin", e.target.value)} /></div>
              <div className="form-group"><label className="form-label">Check-out</label><input className="form-input" type="date" value={form.cout} onChange={e => upd("cout", e.target.value)} /></div>
            </div>
            <div className="form-group"><label className="form-label">Jumlah Malam</label>
              <input className="form-input" type="number" value={nights} readOnly style={{ maxWidth: 100, backgroundColor: "var(--g50)", color: "var(--g600)", cursor: "not-allowed" }} />
            </div>
            <div className="form-group"><label className="form-label">Permintaan Khusus (opsional)</label><textarea className="form-input" rows={2} placeholder="Ex: kamar lantai atas, extra pillow..." value={form.note} onChange={e => upd("note", e.target.value)} /></div>
          </div>
          <div className="booking-section">
            <div className="section-label">Metode Pembayaran</div>
            <div className="chips" style={{ marginBottom: 16 }}>
              {[["bank", "🏦 Transfer Bank"], ["ewallet", "📱 GoPay / OVO"]].map(([v, l]) => (
                <button key={v} className={`chip ${form.payment === v ? "active" : ""}`} onClick={() => upd("payment", v)}>{l}</button>
              ))}
            </div>
            
            {form.payment === "bank" && <div className="alert alert-success"><Icon d={ICONS.check} size={14} />Instruksi transfer akan dikirim ke email kamu setelah booking.</div>}
            {form.payment === "ewallet" && <div className="alert alert-success"><Icon d={ICONS.check} size={14} />Kamu akan diarahkan ke halaman GoPay / OVO untuk menyelesaikan pembayaran.</div>}
          </div>
        </div>
        <div>
          <div className="booking-summary">
            <div className="section-label">Ringkasan Pesanan</div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>{hotel.name}</div>
            <div style={{ fontSize: 12, color: "var(--g600)", marginBottom: 16 }}>{room.name} · {room.desc}</div>
            <div className="summary-row"><span>Harga per malam</span><span>{fmt(room.price)}</span></div>
            <div className="summary-row"><span>Durasi</span><span>{nights} malam</span></div>
            <div className="summary-row"><span>Pajak & Biaya</span><span>Rp 120.000</span></div>
            <div className="summary-total"><span>Total</span><span>{fmt(total)}</span></div>
            <button className="btn btn-primary btn-full" style={{ marginTop: 18 }} onClick={handlePay} disabled={!form.name || !form.email || !form.cin || !form.cout || isLoading}>
              <Icon d={ICONS.shield} size={14} /> {isLoading ? "Memproses..." : "Bayar Sekarang"}
            </button>
            <div style={{ fontSize: 11, color: "var(--g400)", textAlign: "center", marginTop: 10 }}>🔒 Pembayaran dienkripsi & aman</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageConfirm({ confirm, onNavigate }) {
  if (!confirm) return null;
  
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="page-enter">
      <div className="confirm-page">
        <div className="confirm-icon">✓</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, marginBottom: 8 }}>Booking Berhasil!</h2>
        <p style={{ fontSize: 13, color: "var(--g600)", marginBottom: 24, lineHeight: 1.65 }}>Konfirmasi telah dikirim ke email kamu. Tunjukkan kode booking saat check-in.</p>
        <div className="booking-code">
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "var(--g600)", marginBottom: 5 }}>Kode Booking</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, fontWeight: 600, letterSpacing: 2 }}>{confirm.id}</div>
        </div>
        <div className="confirm-details">
          {[
            ["Hotel", confirm.hotelName], 
            ["Kamar", confirm.roomName], 
            ["Tamu", confirm.guestName], 
            ["Check-in", confirm.checkIn], 
            ["Check-out", confirm.checkOut], 
            ["Total Bayar", fmt(confirm.total)]
          ].map(([l, v]) => (
            <div key={l} className="confirm-row"><span className="confirm-label">{l}</span><span style={{ fontWeight: l === "Total Bayar" ? 500 : 400 }}>{v}</span></div>
          ))}
          <div className="confirm-row"><span className="confirm-label">Status</span><StatusBadge status={confirm.status} /></div>
        </div>
        
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }} className="no-print">
          <button className="btn btn-primary" onClick={() => onNavigate("home")}><Icon d={ICONS.home} size={14} />Beranda</button>
          <button className="btn btn-outline" onClick={handleDownload}>
            <Icon d={ICONS.download} size={14} />Unduh / Print Voucher
          </button>
        </div>

      </div>
    </div>
  );
}

export function PageMyBookings({ user }) {
  const [mine, setMine] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchMyBookings = async (pageNumber = 1) => {
    setIsLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Anda belum login atau token kadaluarsa.");
      }

      const res = await fetch(`${API_URL}/bookings?page=${pageNumber}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Gagal mengambil data dari server.");
      }

      let bookingItems = [];
      let current = 1;
      let last = 1;

      if (json.data && Array.isArray(json.data.data)) {
        bookingItems = json.data.data;
        current = json.data.current_page || 1;
        last = json.data.last_page || 1;
      } else if (json.data && Array.isArray(json.data)) {
        bookingItems = json.data;
      } else if (Array.isArray(json)) {
        bookingItems = json;
      }

      setMine(bookingItems);
      setCurrentPage(current);
      setLastPage(last);

    } catch (err) {
      console.error("Error menarik histori:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings(1);
  }, []);

  return (
    <div className="page-enter section">
      <div className="section-header">
        <div>
          <div className="section-title">Pesanan Saya</div>
          <div className="section-sub">
            {isLoading ? "Memuat..." : `Menampilkan halaman ${currentPage}`}
          </div>
        </div>
      </div>
      
      {error && (
        <div className="alert alert-error" style={{ marginBottom: 16 }}>
          <Icon d={ICONS.x} size={14} /> {error}
        </div>
      )}

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--g400)" }}>
           Sedang mengambil data pesanan dari database...
        </div>
      ) : mine.length === 0 && !error ? (
        <div className="empty">
          <div className="empty-icon">📋</div>
          <p>Belum ada booking. Ayo cari hotel!</p>
        </div> 
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mine.map((b) => (
            <div key={b.id} className="card" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 3 }}>
                    StayMatch Hotel
                  </div>
                  <div style={{ fontSize: 12, color: "var(--g600)", marginBottom: 8 }}>
                    Kamar: {b.room?.room_type || b.room?.name || `ID ${b.room_id}`}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--g600)" }}>
                    Check-in: {b.check_in_date} → {b.check_out_date}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge status={b.status} />
                  <div style={{ fontSize: 15, fontWeight: 500, marginTop: 8 }}>
                    {fmt(parseFloat(b.total_price))}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--g600)" }}>
                    Kode: STM-{b.id}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {lastPage > 1 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--g100)" }}>
              <span style={{ fontSize: 13, color: "var(--g600)" }}>
                Halaman {currentPage} dari {lastPage}
              </span>
              
              <div style={{ display: "flex", gap: 10 }}>
                <button 
                  className="btn btn-outline btn-sm" 
                  disabled={currentPage <= 1} 
                  onClick={() => fetchMyBookings(currentPage - 1)}
                >
                  ← Sebelumnya
                </button>
                
                <button 
                  className="btn btn-outline btn-sm" 
                  disabled={currentPage >= lastPage} 
                  onClick={() => fetchMyBookings(currentPage + 1)}
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}