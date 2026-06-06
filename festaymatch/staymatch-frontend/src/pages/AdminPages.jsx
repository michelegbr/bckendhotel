import { useState, useEffect } from "react";
import { ICONS, fmt } from "../data/mockData";
import { Icon, StatusBadge, Toast, Modal } from "../components/Shared";

function AdminDashboard({ bookings, hotels, users }) {
  const total = bookings.reduce((s, b) => s + (b.status !== "cancelled" ? b.total : 0), 0);
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const recentBookings = [...bookings].reverse().slice(0, 5);
  return (
    <div className="page-enter">
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: "Total Pendapatan", value: fmt(total), sub: "dari semua booking", badge: "+12.5% bulan ini" },
          { label: "Total Booking", value: bookings.length, sub: `${confirmed} dikonfirmasi`, badge: `${pending} menunggu` },
          { label: "Hotel Aktif", value: hotels.filter(h => h.available).length, sub: `dari ${hotels.length} total hotel`, badge: "" },
          { label: "Pengguna", value: users.filter(u => u.role === "user").length, sub: "user terdaftar", badge: "+3 minggu ini" },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-sub">{s.sub}</div>
            {s.badge && <div className="stat-badge">↑ {s.badge}</div>}
          </div>
        ))}
      </div>
      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 14, fontFamily: "'Playfair Display',serif" }}>Booking Terbaru</div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>ID Booking</th><th>Tamu</th><th>Hotel</th><th>Check-in</th><th>Total</th><th>Status</th>
          </tr></thead>
          <tbody>
            {recentBookings.map(b => (
              <tr key={b.id}>
                <td style={{ fontFamily: "monospace", fontSize: 12 }}>{b.id}</td>
                <td><div style={{ fontWeight: 500 }}>{b.guestName}</div><div style={{ fontSize: 11, color: "var(--g600)" }}>{b.email}</div></td>
                <td><div>{b.hotelName}</div><div style={{ fontSize: 11, color: "var(--g600)" }}>{b.roomName}</div></td>
                <td style={{ fontSize: 13 }}>{b.checkIn}</td>
                <td style={{ fontWeight: 500 }}>{fmt(b.total)}</td>
                <td><StatusBadge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminBookings({ bookings, setBookings }) {
  const [search, setSearch] = useState("");
  const [statusF, setStatusF] = useState("all");
  const filtered = bookings.filter(b => {
    if (statusF !== "all" && b.status !== statusF) return false;
    if (search && !b.guestName?.toLowerCase().includes(search.toLowerCase()) && !b.id?.toString().includes(search) && !b.hotelName?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });
  const updateStatus = (id, status) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  return (
    <div className="page-enter">
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--g400)" }}><Icon d={ICONS.search} size={13} /></span>
          <input className="form-input" placeholder="Cari booking..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30 }} />
        </div>
        <select className="form-input" style={{ maxWidth: 160 }} value={statusF} onChange={e => setStatusF(e.target.value)}>
          <option value="all">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="confirmed">Dikonfirmasi</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr>
            <th>ID</th><th>Tamu</th><th>Hotel / Kamar</th><th>Tanggal</th><th>Total</th><th>Status</th><th>Aksi</th>
          </tr></thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td style={{ fontFamily: "monospace", fontSize: 11 }}>{b.id}</td>
                <td><div style={{ fontWeight: 500, fontSize: 13 }}>{b.guestName}</div><div style={{ fontSize: 11, color: "var(--g600)" }}>{b.email}</div></td>
                <td><div style={{ fontSize: 13 }}>{b.hotelName}</div><div style={{ fontSize: 11, color: "var(--g600)" }}>{b.roomName}</div></td>
                <td style={{ fontSize: 12 }}>{b.checkIn}<br /><span style={{ color: "var(--g600)" }}>→ {b.checkOut}</span></td>
                <td style={{ fontWeight: 500, fontSize: 13 }}>{fmt(b.total)}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    {b.status === "pending" && <button className="btn btn-success btn-sm" onClick={() => updateStatus(b.id, "confirmed")}>✓</button>}
                    {b.status !== "cancelled" && b.status !== "completed" && <button className="btn btn-danger btn-sm" onClick={() => updateStatus(b.id, "cancelled")}>✕</button>}
                    {b.status === "confirmed" && <button className="btn btn-outline btn-sm" onClick={() => updateStatus(b.id, "completed")}>Selesai</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminHotels({ hotels, setHotels }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const openAdd = () => { setForm({ name: "", city: "", location: "", price: "", stars: 4, emoji: "🏨", tag: "", available: true, amenities: "", desc: "" }); setModal("add"); };
  const openEdit = (h) => { setForm({ ...h, amenities: h.amenities ? h.amenities.join(", ") : "" }); setModal("edit"); };
  const save = () => {
    const h = { ...form, price: parseInt(form.price) || 0, stars: parseInt(form.stars), amenities: form.amenities.split(",").map(a => a.trim()).filter(Boolean), rooms: form.rooms || [], rating: form.rating || 4.5, reviews: form.reviews || 0 };
    if (modal === "add") { setHotels(prev => [...prev, { ...h, id: Date.now() }]); }
    else { setHotels(prev => prev.map(x => x.id === h.id ? h : x)); }
    setModal(null);
  };
  const del = (id) => setHotels(prev => prev.filter(h => h.id !== id));
  const toggle = (id) => setHotels(prev => prev.map(h => h.id === id ? { ...h, available: !h.available } : h));

  return (
    <div className="page-enter">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Icon d={ICONS.plus} size={13} />Tambah Hotel</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Hotel</th><th>Lokasi</th><th>Bintang</th><th>Harga</th><th>Kamar</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {hotels.map(h => (
              <tr key={h.id}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 20 }}>{h.emoji}</span><div><div style={{ fontWeight: 500, fontSize: 13 }}>{h.name}</div><div style={{ fontSize: 11, color: "var(--g600)" }}>{h.tag}</div></div></div></td>
                <td style={{ fontSize: 13 }}>{h.location}</td>
                <td style={{ fontSize: 13 }}>{"★".repeat(h.stars)}</td>
                <td style={{ fontSize: 13, fontWeight: 500 }}>{fmt(h.price)}</td>
                <td style={{ fontSize: 13 }}>{h.rooms?.length || 0} tipe</td>
                <td><span className={`badge ${h.available ? "badge-green" : "badge-red"}`}>{h.available ? "Tersedia" : "Penuh"}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => toggle(h.id)}>{h.available ? "Non-aktif" : "Aktifkan"}</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(h)}><Icon d={ICONS.edit} size={13} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => del(h.id)}><Icon d={ICONS.trash} size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title={modal === "add" ? "Tambah Hotel" : "Edit Hotel"} onClose={() => setModal(null)}>
          <div className="form-group"><label className="form-label">Nama Hotel</label><input className="form-input" value={form.name} onChange={e => upd("name", e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Kota</label><input className="form-input" value={form.city} onChange={e => upd("city", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Lokasi Lengkap</label><input className="form-input" value={form.location} onChange={e => upd("location", e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Harga/Malam</label><input className="form-input" type="number" value={form.price} onChange={e => upd("price", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Bintang</label><select className="form-input" value={form.stars} onChange={e => upd("stars", e.target.value)}>{[1,2,3,4,5].map(s=><option key={s} value={s}>{s} Bintang</option>)}</select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Emoji</label><input className="form-input" value={form.emoji} onChange={e => upd("emoji", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Tag</label><input className="form-input" value={form.tag} onChange={e => upd("tag", e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Fasilitas (pisah koma)</label><input className="form-input" value={form.amenities} onChange={e => upd("amenities", e.target.value)} placeholder="Kolam Renang, Free Wifi, Sarapan" /></div>
          <div className="form-group"><label className="form-label">Deskripsi</label><textarea className="form-input" rows={3} value={form.desc} onChange={e => upd("desc", e.target.value)} /></div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button className="btn btn-outline" onClick={() => setModal(null)}>Batal</button>
            <button className="btn btn-primary" onClick={save}>Simpan</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AdminUsers({ users, setUsers }) {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
  const del = (id) => setUsers(prev => prev.filter(u => u.id !== id));
  return (
    <div className="page-enter">
      <div style={{ marginBottom: 16 }}>
        <div style={{ position: "relative", maxWidth: 320 }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--g400)" }}><Icon d={ICONS.search} size={13} /></span>
          <input className="form-input" placeholder="Cari pengguna..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 30 }} />
        </div>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Pengguna</th><th>Email</th><th>Role</th><th>Bergabung</th><th>Aksi</th></tr></thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--g100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{u.name.charAt(0)}</div>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{u.name}</div>
                  </div>
                </td>
                <td style={{ fontSize: 13, color: "var(--g600)" }}>{u.email}</td>
                <td><span className={`badge ${u.role === "admin" ? "badge-black" : "badge-default"}`}>{u.role}</span></td>
                <td style={{ fontSize: 13 }}>{u.joined || "Hari ini"}</td>
                <td>
                  {u.role !== "admin" && <button className="btn btn-danger btn-sm" onClick={() => del(u.id)}><Icon d={ICONS.trash} size={13} /></button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminLogs() {
  return (
    <div className="page-enter">
    <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 14, fontFamily: "'Playfair Display',serif" }}>Audit Logs</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Waktu</th><th>Pengguna</th><th>Tindakan</th><th>Keterangan</th></tr></thead>
          <tbody>
            <tr><td style={{ fontSize: 12, color: "var(--g600)" }}>Hari ini, 11:05</td><td style={{ fontWeight: 500 }}>Admin</td><td><span className="badge badge-green">UPDATE</span></td><td>Mengonfirmasi booking STM-992</td></tr>
            <tr><td style={{ fontSize: 12, color: "var(--g600)" }}>Hari ini, 10:30</td><td style={{ fontWeight: 500 }}>User Baru</td><td><span className="badge badge-default">CREATE</span></td><td>Membuat pesanan kamar VIP (STM-992)</td></tr>
            <tr><td style={{ fontSize: 12, color: "var(--g600)" }}>Hari ini, 09:15</td><td style={{ fontWeight: 500 }}>System</td><td><span className="badge badge-black">AUTH</span></td><td>Admin berhasil login ke sistem</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminPanel({ onLogout, bookings, setBookings, hotels, setHotels, users, setUsers }) {
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState("");
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3200); };

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json", "Content-Type": "application/json" };
      try {
        const resRooms = await fetch("http://127.0.0.1:8000/api/rooms", { headers });
        const dataRooms = await resRooms.json();
        
        let roomList = [];
        if (Array.isArray(dataRooms)) roomList = dataRooms;
        else if (dataRooms?.data && Array.isArray(dataRooms.data)) roomList = dataRooms.data;
        else if (dataRooms?.data?.data && Array.isArray(dataRooms.data.data)) roomList = dataRooms.data.data;
        else if (dataRooms?.data && typeof dataRooms.data === 'object') roomList = Object.values(dataRooms.data);
        else if (typeof dataRooms === 'object') roomList = Object.values(dataRooms);

        const validRooms = roomList.filter(r => r && typeof r === 'object' && r.id);

        if (validRooms.length > 0) {
          const mappedHotels = validRooms.map(room => ({
            id: room.id,
            name: `Kamar ${room.room_type || 'Tipe'} (${room.room_number || '-'})`,
            location: "StayMatch Hotel Pusat",
            price: room.price_per_night || 0,
            stars: 5,
            emoji: "🛏️",
            tag: room.status === "available" ? "Tersedia" : "Penuh",
            available: room.status === "available",
            amenities: ["AC", "Free Wifi", "Smart TV", "Kulkas"],
            rooms: [{ id: room.id, name: room.room_type }]
          }));
          setHotels(mappedHotels); 
        }
      } catch (e) {
        console.error("Gagal memuat data kamar di admin:", e);
      }
    };
    fetchAdminData();
  }, [setHotels]); 

  // ==========================================
  // MENU NAVIGASI DITAMBAH AUDIT LOGS
  // ==========================================
  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: ICONS.chart },
    { key: "bookings", label: "Booking", icon: ICONS.booking },
    { key: "hotels", label: "Hotel", icon: ICONS.hotel },
    { key: "users", label: "Pengguna", icon: ICONS.users },
    { key: "logs", label: "Audit Logs", icon: ICONS.menu }, // <-- Fitur baru di sini
  ];

  const titles = { dashboard: "Dashboard", bookings: "Manajemen Booking", hotels: "Manajemen Hotel", users: "Manajemen Pengguna", logs: "Audit Logs" };

  return (
    <div className="admin-layout" style={{ background: "var(--g50)", minHeight: "100vh" }}>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo">Stay<span>match</span></div>
          <span className="badge badge-black" style={{ marginTop: 5, fontSize: 10 }}>Admin</span>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Menu</div>
          {navItems.map(item => (
            <button key={item.key} className={`sidebar-item ${tab === item.key ? "active" : ""}`}
              onClick={() => { setTab(item.key); setSidebarOpen(false); }}>
              <Icon d={item.icon} size={15} />{item.label}
            </button>
          ))}
          <div className="sidebar-section" style={{ marginTop: 12 }}>Sistem</div>
          <button className="sidebar-item" onClick={onLogout}><Icon d={ICONS.logout} size={15} />Keluar</button>
        </nav>
      </div>
      <div className="admin-main">
        <div className="admin-topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn btn-ghost btn-sm hamburger" onClick={() => setSidebarOpen(o => !o)} style={{ display: "flex" }}>
              <Icon d={ICONS.menu} size={18} />
            </button>
            <div className="admin-topbar-title">{titles[tab]}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button className="btn btn-ghost btn-sm"><Icon d={ICONS.bell} size={16} /></button>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--black)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--white)", fontSize: 12, fontWeight: 500 }}>A</div>
          </div>
        </div>
        <div className="admin-content">
          {tab === "dashboard" && <AdminDashboard bookings={bookings} hotels={hotels} users={users} />}
          {tab === "bookings" && <AdminBookings bookings={bookings} setBookings={(b) => { setBookings(b); showToast("Status booking diperbarui"); }} />}
          {tab === "hotels" && <AdminHotels hotels={hotels} setHotels={(h) => { setHotels(h); showToast("Data hotel disimpan"); }} />}
          {tab === "users" && <AdminUsers users={users} setUsers={(u) => { setUsers(u); showToast("Data pengguna diperbarui"); }} />}
          
          {/* PEMANGGIL KOMPONEN AUDIT LOGS */}
          {tab === "logs" && <AdminLogs />}
        </div>
      </div>
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      {sidebarOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 140 }} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}