import { useState } from "react";
import "./index.css";
import { BOOKINGS_INIT, HOTELS, USERS_INIT, ICONS } from "./data/mockData";
import { Icon, Toast, Modal } from "./components/Shared";
import { PageLogin, PageRegister, AdminLogin } from "./pages/AuthPages";
import { PageHome, PageSearch, PageDetail, PageBooking, PageConfirm, PageMyBookings } from "./pages/UserPages";
import { AdminPanel } from "./pages/AdminPages";

export default function App() {
  const [mode, setMode] = useState("user"); 
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [detail, setDetail] = useState(null);
  const [booking, setBooking] = useState(null);
  const [confirm, setConfirm] = useState(null);
  
  // State Utama Data
  const [bookings, setBookings] = useState(BOOKINGS_INIT);
  const [hotels, setHotels] = useState(HOTELS);
  const [users, setUsers] = useState(USERS_INIT);
  
  const [mobileNav, setMobileNav] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [toast, setToast] = useState("");

  const navigate = (p, data) => {
    if (p === "detail" && data) setDetail(data);
    if (p === "booking" && data) setBooking(data);
    setPage(p);
    setMobileNav(false);
    window.scrollTo(0, 0);
  };

  const logout = () => { setUser(null); setPage("home"); setMode("user"); setIsAdmin(false); };
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(""), 3000); };

  if (mode === "admin") {
    if (!isAdmin) return <AdminLogin onLogin={() => setIsAdmin(true)} />;
    return <AdminPanel onLogout={() => { setMode("user"); setIsAdmin(false); }} bookings={bookings} setBookings={setBookings} hotels={hotels} setHotels={setHotels} users={users} setUsers={setUsers} />;
  }

  const navLinks = [
    { label: "Beranda", page: "home" },
    { label: "Cari Hotel", page: "search" },
    ...(user ? [{ label: "Pesanan Saya", page: "mybookings" }] : []),
  ];

  return (
    <>
      <nav className="nav">
        <div className="logo" onClick={() => navigate("home")}>Stay<span>match</span></div>
        <div className={`nav-links ${mobileNav ? "open" : ""}`}>
          {navLinks.map(l => (
            <button key={l.page} className={`nav-link ${page === l.page ? "active" : ""}`} style={page === l.page ? { background: "var(--g100)", color: "var(--black)" } : {}} onClick={() => navigate(l.page)}>{l.label}</button>
          ))}
          {user ? (
            <>
              <span style={{ fontSize: 13, color: "var(--g600)", padding: "7px 10px" }}>Hi, {user.name.split(" ")[0]}</span>
              <button className="nav-link" onClick={logout}>Keluar</button>
            </>
          ) : (
            <>
              <button className="nav-link" onClick={() => navigate("login")}>Masuk</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate("register")}>Daftar</button>
            </>
          )}
          
          {/* TOMBOL ADMIN MUNCUL UNTUK TAMU (Belum Login) ATAU UNTUK ADMIN */}
          {(!user || user.role === "admin") && (
            <button className="nav-link btn-sm" style={{ color: "var(--g400)", fontSize: 11, borderLeft: "1px solid var(--g100)" }} onClick={() => setMode("admin")}>
              Admin Panel ↗
            </button>
          )}
          
        </div>
        <button className="hamburger" onClick={() => setMobileNav(o => !o)}>
          <Icon d={ICONS.menu} size={20} />
        </button>
      </nav>

      {page === "home" && <PageHome onNavigate={navigate} />}
      {page === "search" && <PageSearch onNavigate={navigate} />}
      {page === "detail" && <PageDetail hotel={detail} onNavigate={navigate} user={user} onNeedLogin={() => { setLoginModal(true); }} />}
      {page === "booking" && <PageBooking booking={booking} onNavigate={navigate} onConfirm={(c) => { const full = { ...c, userId: user?.id }; setBookings(prev => [...prev, full]); setConfirm(c); showToast("Booking berhasil dikonfirmasi!"); }} />}
      {page === "confirm" && <PageConfirm confirm={confirm} onNavigate={navigate} />}
      {page === "mybookings" && <PageMyBookings user={user} />}
      {page === "login" && <PageLogin onLogin={setUser} onNavigate={navigate} />}
      {page === "register" && <PageRegister onLogin={setUser} onNavigate={navigate} />}

      {loginModal && (
        <Modal title="Login diperlukan" onClose={() => setLoginModal(false)}>
          <p style={{ fontSize: 13, color: "var(--g600)", marginBottom: 18 }}>Kamu perlu login dulu untuk melakukan booking hotel.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-primary btn-full" onClick={() => { setLoginModal(false); navigate("login"); }}>Masuk</button>
            <button className="btn btn-outline btn-full" onClick={() => { setLoginModal(false); navigate("register"); }}>Daftar</button>
          </div>
        </Modal>
      )}

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </>
  );
}