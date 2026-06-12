import { useState } from "react";
import { ICONS } from "../data/mockData";
import { Icon } from "../components/Shared";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export function PageLogin({ onLogin, onNavigate }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
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

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Email atau password salah!");
      }

      // Simpan token asli dari database ke penyimpanan browser
      const token = data.access_token || data.token;
      if (!token) {
        throw new Error("Token tidak diterima dari server.");
      }
      localStorage.setItem("token", token);

      // Meneruskan data user asli dari database ke state React
      onLogin({
        id: data.user?.id,
        name: data.user?.name || form.email.split("@")[0],
        email: data.user?.email || form.email,
        role: data.role || data.user?.role || "customer",
      });

      onNavigate("home");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrap page-enter">
      <div className="auth-card">
        <div className="logo" style={{ marginBottom: 24, fontSize: 28 }}>
          Stay<span>match</span>
        </div>
        <div className="auth-title">Selamat Datang</div>
        <div className="auth-sub">Masuk untuk melanjutkan pemesanan.</div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <Icon d={ICONS.x} size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              required
              placeholder="kamu@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: 10 }}
            disabled={isLoading}
          >
            {isLoading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <div className="auth-switch">
          Belum punya akun?{" "}
          <button onClick={() => onNavigate("register")}>Daftar sekarang</button>
        </div>
      </div>
    </div>
  );
}

export function PageRegister({ onLogin, onNavigate }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (form.password !== form.password_confirmation) {
      setError("Password dan konfirmasi password tidak cocok.");
      setIsLoading(false);
      return;
    }
    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          password_confirmation: form.password_confirmation,
          role: "customer",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0];
          throw new Error(
            Array.isArray(firstError) ? firstError[0] : firstError
          );
        }
        throw new Error(data.message || "Gagal melakukan registrasi!");
      }

      const token = data.access_token || data.token;
      if (token) {
        localStorage.setItem("token", token);
      }

      onLogin({
        id: data.user?.id,
        name: data.user?.name || form.name,
        email: data.user?.email || form.email,
        role: data.user?.role || "customer",
      });

      onNavigate("home");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-wrap page-enter">
      <div className="auth-card">
        <div className="logo" style={{ marginBottom: 24, fontSize: 28 }}>
          Stay<span>match</span>
        </div>
        <div className="auth-title">Buat Akun</div>
        <div className="auth-sub">Daftar untuk menikmati kemudahan booking.</div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>
            <Icon d={ICONS.x} size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input
              className="form-input"
              required
              placeholder="Nama sesuai KTP"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              required
              placeholder="kamu@email.com"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              required
              minLength={8}
              placeholder="Minimal 8 karakter"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Konfirmasi Password</label>
            <input
              className="form-input"
              type="password"
              required
              placeholder="Ulangi password"
              value={form.password_confirmation}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  password_confirmation: e.target.value,
                }))
              }
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
            style={{ marginTop: 10 }}
            disabled={isLoading}
          >
            {isLoading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <div className="auth-switch">
          Sudah punya akun?{" "}
          <button onClick={() => onNavigate("login")}>Masuk di sini</button>
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
    if (!form.email || !form.password) {
      setErr("Email dan password wajib diisi.");
      return;
    }
    setErr("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
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

      // Pertahanan lapis pertama di Frontend: pastikan hanya admin yang bisa lewat
      const role = data.role || data.user?.role;
      if (role !== "admin") {
        throw new Error("Akses Ditolak: Anda bukan Administrator.");
      }

      const token = data.access_token || data.token;
      if (!token) {
        throw new Error("Token tidak diterima dari server.");
      }

      localStorage.setItem("token", token);
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
          <div className="logo" style={{ fontSize: 22, marginBottom: 6 }}>
            Stay<span>match</span>
          </div>
          <span className="badge badge-black">Admin Panel</span>
        </div>
        <div className="auth-title" style={{ fontSize: 20 }}>
          Masuk sebagai Admin
        </div>
        <div className="auth-sub">Akses dashboard manajemen StayMatch</div>

        {err && (
          <div className="alert alert-error" style={{ fontSize: 12 }}>
            <Icon d={ICONS.x} size={13} /> {err}
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email Admin</label>
          <input
            className="form-input"
            type="email"
            placeholder="admin@staymatch.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            onKeyDown={(e) => e.key === "Enter" && handle()}
          />
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