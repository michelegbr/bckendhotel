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
          { label: "Hotel Aktif", value: hotels.length, sub: `dari ${hotels.length} total kamar`, badge: "" },
          { label: "Pengguna", value: users.length, sub: "user terdaftar", badge: "" },
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
            <th>ID Booking</th><th>Tamu</th><th>Hotel / Kamar</th><th>Check-in</th><th>Total</th><th>Status</th>
          </tr></thead>
          <tbody>
            {recentBookings.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:"center", padding:"20px", color:"var(--g400)"}}>Belum ada data transaksi.</td></tr>
            ) : (
              recentBookings.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 12 }}>STM-{b.id}</td>
                  <td><div style={{ fontWeight: 500 }}>{b.guestName}</div><div style={{ fontSize: 11, color: "var(--g600)" }}>{b.email}</div></td>
                  <td><div>{b.hotelName}</div><div style={{ fontSize: 11, color: "var(--g600)" }}>{b.roomName}</div></td>
                  <td style={{ fontSize: 13 }}>{b.checkIn}</td>
                  <td style={{ fontWeight: 500 }}>{fmt(b.total)}</td>
                  <td><StatusBadge status={b.status} /></td>
                </tr>
              ))
            )}
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

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal mengubah status di server.");
      }

      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

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
            {filtered.length === 0 ? (
               <tr><td colSpan="7" style={{textAlign:"center", padding:"20px", color:"var(--g400)"}}>Tidak ada data booking yang sesuai.</td></tr>
            ) : (
              filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ fontFamily: "monospace", fontSize: 11 }}>STM-{b.id}</td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminHotels({ hotels, setHotels }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const openAdd = () => { setForm({ name: "", city: "Jakarta", location: "StayMatch Hotel", price: "", stars: 5, emoji: "🏨", tag: "", available: true, amenities: "AC, Wifi", desc: "" }); setModal("add"); };
  const openEdit = (h) => { setForm({ ...h, name: h.name.replace("Kamar ", ""), amenities: h.amenities ? h.amenities.join(", ") : "" }); setModal("edit"); };

  // 🚀 API POST/PUT: SIMPAN KE DATABASE
  const save = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      
      // Sesuaikan format React dengan kolom database Laravel
      const payload = {
        room_type: form.name,
        price_per_night: parseInt(form.price) || 0,
        description: form.desc,
        status: form.available ? "available" : "maintenance"
      };

      let res;
      if (modal === "add") {
        res = await fetch("http://127.0.0.1:8000/api/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`http://127.0.0.1:8000/api/rooms/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error("Gagal menyimpan data kamar ke server");
      
      const dbData = await res.json();
      const savedRoom = dbData.data || dbData;

      // Konversi format database kembali ke format UI React
      const mappedHotel = {
        ...form,
        id: savedRoom.id,
        name: `Kamar ${savedRoom.room_type}`,
        price: savedRoom.price_per_night,
        desc: savedRoom.description,
        tag: savedRoom.status === "available" ? "Tersedia" : "Penuh",
        available: savedRoom.status === "available",
        rooms: [{ id: savedRoom.id, name: savedRoom.room_type }]
      };

      if (modal === "add") {
        setHotels(prev => [mappedHotel, ...prev]);
      } else {
        setHotels(prev => prev.map(x => x.id === mappedHotel.id ? mappedHotel : x));
      }
      setModal(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // 🚀 API DELETE: HAPUS DARI DATABASE
  const del = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kamar ini secara permanen?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/rooms/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Gagal menghapus data");
      setHotels(prev => prev.filter(h => h.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // 🚀 API PUT: UBAH STATUS AKTIF/NON-AKTIF CEPAT
  const toggle = async (hotel) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = hotel.available ? "maintenance" : "available";
      
      const res = await fetch(`http://127.0.0.1:8000/api/rooms/${hotel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) throw new Error("Gagal mengubah status");
      setHotels(prev => prev.map(h => h.id === hotel.id ? { ...h, available: !h.available, tag: newStatus === "available" ? "Tersedia" : "Penuh" } : h));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page-enter">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Icon d={ICONS.plus} size={13} />Tambah Kamar</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Nama Kamar</th><th>Lokasi</th><th>Harga</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {hotels.map(h => (
              <tr key={h.id}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 20 }}>{h.emoji}</span><div><div style={{ fontWeight: 500, fontSize: 13 }}>{h.name}</div><div style={{ fontSize: 11, color: "var(--g600)" }}>{h.tag}</div></div></div></td>
                <td style={{ fontSize: 13 }}>{h.location}</td>
                <td style={{ fontSize: 13, fontWeight: 500 }}>{fmt(h.price)}</td>
                <td><span className={`badge ${h.available ? "badge-green" : "badge-red"}`}>{h.available ? "Tersedia" : "Maintenance"}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => toggle(h)}>{h.available ? "Non-aktif" : "Aktifkan"}</button>
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
        <Modal title={modal === "add" ? "Tambah Kamar Baru" : "Edit Kamar"} onClose={() => setModal(null)}>
          <div className="form-group"><label className="form-label">Tipe Kamar</label><input className="form-input" placeholder="Misal: Presidential Suite" value={form.name} onChange={e => upd("name", e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Harga/Malam</label><input className="form-input" type="number" placeholder="Contoh: 1500000" value={form.price} onChange={e => upd("price", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Status Awal</label>
              <select className="form-input" value={form.available ? "1" : "0"} onChange={e => upd("available", e.target.value === "1")}>
                <option value="1">Tersedia (Bisa dipesan)</option>
                <option value="0">Maintenance (Ditutup)</option>
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Deskripsi Fasilitas</label><textarea className="form-input" rows={3} value={form.desc} onChange={e => upd("desc", e.target.value)} /></div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 6 }}>
            <button className="btn btn-outline" onClick={() => setModal(null)}>Batal</button>
            <button className="btn btn-primary" onClick={save} disabled={isSaving}>{isSaving ? "Menyimpan..." : "Simpan ke Database"}</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AdminUsers({ users, setUsers }) {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));
  
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
          <thead><tr><th>Pengguna</th><th>Email</th><th>Role</th><th>Bergabung</th></tr></thead>
          <tbody>
            {filtered.length === 0 ? (
               <tr><td colSpan="4" style={{textAlign:"center", padding:"20px", color:"var(--g400)"}}>Data pengguna tidak ditemukan.</td></tr>
            ) : (
              filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--g100)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, flexShrink: 0 }}>{u.name?.charAt(0) || "U"}</div>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{u.name}</div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: "var(--g600)" }}>{u.email}</td>
                  <td><span className={`badge ${u.role === "admin" ? "badge-black" : "badge-default"}`}>{u.role}</span></td>
                  <td style={{ fontSize: 13 }}>Hari ini</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminLogs({ logs }) {
  return (
    <div className="page-enter">
      <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 14, fontFamily: "'Playfair Display',serif" }}>Audit Logs</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Waktu</th><th>User ID</th><th>Tindakan</th><th>Keterangan</th></tr></thead>
          <tbody>
            {(!logs || logs.length === 0) ? (
              <tr><td colSpan="4" style={{textAlign:"center", padding:"20px", color:"var(--g400)"}}>Belum ada riwayat aktivitas.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td style={{ fontSize: 12, color: "var(--g600)" }}>
                    {new Date(log.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                  </td>
                  <td style={{ fontWeight: 500 }}>{log.user_id ? `User #${log.user_id}` : "System"}</td>
                  <td>
                    <span className={`badge ${log.action === 'LOGIN' ? 'badge-black' : (log.action === 'UPDATE' ? 'badge-green' : 'badge-default')}`}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ fontSize: 13 }}>{log.details}</td>
                </tr>
              ))
            )}
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
  const [logs, setLogs] = useState([]);
  
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3200); };

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json", "Content-Type": "application/json" };
      
      try {
        const resRooms = await fetch("http://127.0.0.1:8000/api/rooms", { headers });
        if (resRooms.ok) {
          const dataRooms = await resRooms.json();
          let roomList = dataRooms?.data?.data || dataRooms?.data || dataRooms || [];
          const validRooms = roomList.filter(r => r && typeof r === 'object' && r.id);

          setHotels(validRooms.map(room => ({
            id: room.id,
            name: `Kamar ${room.room_type || 'Tipe'} (${room.room_number || '-'})`,
            location: "StayMatch Hotel Pusat",
            price: room.price_per_night || 0,
            stars: 5, emoji: "🛏️",
            tag: room.status === "available" ? "Tersedia" : "Penuh",
            available: room.status === "available",
            amenities: ["AC", "Free Wifi", "Smart TV"],
            rooms: [{ id: room.id, name: room.room_type }]
          })));
        }

        const resBookings = await fetch("http://127.0.0.1:8000/api/bookings", { headers });
        if (resBookings.ok) {
          const rawBookings = await resBookings.json();
          let bookingData = rawBookings?.data?.data || rawBookings?.data || rawBookings || [];
          
          setBookings(bookingData.map(b => ({
            id: b.id,
            guestName: b.user?.name || `User ID #${b.user_id}`, 
            email: b.user?.email || "-",
            hotelName: "StayMatch Hotel",
            roomName: b.room?.room_type || `Kamar ID ${b.room_id}`,
            checkIn: b.check_in_date,
            checkOut: b.check_out_date,
            total: parseFloat(b.total_price),
            status: b.status
          })));
        }

        const resUsers = await fetch("http://127.0.0.1:8000/api/users", { headers });
        if (resUsers.ok) {
          const dataUsers = await resUsers.json();
          setUsers(Array.isArray(dataUsers) ? dataUsers : []);
        }

        const resLogs = await fetch("http://127.0.0.1:8000/api/audit-logs", { headers });
        if (resLogs.ok) {
          const dataLogs = await resLogs.json();
          setLogs(Array.isArray(dataLogs) ? dataLogs : []);
        }

      } catch (e) {
        console.error("Gagal memuat data dasbor admin:", e);
      }
    };
    
    fetchAdminData();
  }, [setHotels, setBookings, setUsers]); 

  const navItems = [
    { key: "dashboard", label: "Dashboard", icon: ICONS.chart },
    { key: "bookings", label: "Booking", icon: ICONS.booking },
    { key: "hotels", label: "Hotel", icon: ICONS.hotel },
    { key: "users", label: "Pengguna", icon: ICONS.users },
    { key: "logs", label: "Audit Logs", icon: ICONS.menu }, 
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
          {tab === "logs" && <AdminLogs logs={logs} />}
        </div>
      </div>
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
      {sidebarOpen && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.3)", zIndex: 140 }} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}