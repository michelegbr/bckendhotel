import { useState } from "react";
import { Icon } from "../components/Shared";
import { ICONS } from "../data/mockData";

export function PageLogin({ onLogin, onNavigate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Email atau password salah!");
      }

      localStorage.setItem("token", data.access_token);
      
      onLogin({ 
        name: form.email.split("@")[0], 
        email: form.email, 
        role: data.role || "user"
      });
      
      onNavigate("home");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout page-enter">
      <div className="auth-card">
        <div className="logo" style={{ marginBottom: 24, fontSize: 28 }}>Stay<span>match</span></div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 6 }}>Selamat Datang</h2>
        <p style={{ fontSize: 13, color: "var(--g600)", marginBottom: 24 }}>Masuk untuk melanjutkan pemesanan.</p>
        
        {error && <div className="alert alert-red" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 10 }} disabled={isLoading}>
            {isLoading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          Belum punya akun? <span style={{ color: "var(--primary)", fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate("register")}>Daftar sekarang</span>
        </div>
      </div>
    </div>
  );
}

export function PageRegister({ onLogin, onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Tembak API Register Laravel
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(form)
      });
      
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.errors ? Object.values(data.errors)[0][0] : data.message;
        throw new Error(errorMsg || "Gagal melakukan registrasi!");
      }

      localStorage.setItem("token", data.access_token);
      
      onLogin({ 
        name: data.user?.name || form.name, 
        email: data.user?.email || form.email, 
        role: data.user?.role || form.role,
        id: data.user?.id 
      });
      
      onNavigate("home");

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-layout page-enter">
      <div className="auth-card">
        <div className="logo" style={{ marginBottom: 24, fontSize: 28 }}>Stay<span>match</span></div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", marginBottom: 6 }}>Buat Akun</h2>
        <p style={{ fontSize: 13, color: "var(--g600)", marginBottom: 24 }}>Daftar untuk menikmati kemudahan booking.</p>

        {error && <div className="alert alert-red" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input className="form-input" required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" required minLength={8} value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: 10 }} disabled={isLoading}>
            {isLoading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13 }}>
          Sudah punya akun? <span style={{ color: "var(--primary)", fontWeight: 500, cursor: "pointer" }} onClick={() => onNavigate("login")}>Masuk di sini</span>
        </div>
      </div>
    </div>
  );
}

export function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  const handle = async () => {
    setErr("");
    setIsLoading(true);

    try {
      // 2. Tembak API Login Laravel menggunakan metode POST
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email atau password salah.");
      }

      localStorage.setItem("token", data.token || data.access_token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      onLogin(data.user);

    } catch (error) {
      setErr(error.message);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="auth-wrap" style={{ background: "var(--black)" }}>
      <div className="auth-card page-enter">
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div className="logo" style={{ fontSize: 22, marginBottom: 6 }}>Stay<span>match</span></div>
          <span className="badge badge-black">Admin Panel</span>
        </div>
        <div className="auth-title" style={{ fontSize: 20 }}>Masuk sebagai Admin</div>
        <div className="auth-sub">Akses dashboard manajemen StayMatch</div>
        
        {err && <div className="alert alert-error" style={{ fontSize: 12 }}>{err}</div>}
        
        <div className="form-group">
          <label className="form-label">Email Admin</label>
          <input className="form-input" type="email" placeholder="Masukkan email dari database..." value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
        </div>
        
        <button 
          className="btn btn-primary btn-full" 
          onClick={handle}
          disabled={isLoading}
        >
          {isLoading ? "Memeriksa data..." : "Masuk ke Dashboard"}
        </button>
      </div>
    </div>
  );
}