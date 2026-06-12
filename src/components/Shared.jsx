import { useEffect } from "react";
import { ICONS, fmt } from "../data/mockData";

export function Icon({ d, size = 16, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
    </svg>
  );
}

export function StatusBadge({ status }) {
  const map = { confirmed: ["badge-green", "Dikonfirmasi"], pending: ["badge-amber", "Menunggu"], completed: ["badge-blue", "Selesai"], cancelled: ["badge-red", "Dibatalkan"] };
  const [cls, label] = map[status] || ["badge-default", status];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast"><Icon d={ICONS.check} size={14} />{msg}</div>;
}

export function HotelCard({ hotel, onClick }) {
  return (
    <div className="hotel-card" onClick={() => onClick(hotel)}>
      <div className="hotel-thumb">
        <span>{hotel.emoji}</span>
        <span className="hotel-thumb-tag">{hotel.tag}</span>
        {!hotel.available && <span style={{ position: "absolute", top: 10, right: 12, background: "#fee2e2", color: "#b91c1c", fontSize: 10, padding: "2px 8px", borderRadius: 20 }}>Penuh</span>}
      </div>
      <div className="hotel-body">
        <div className="hotel-name">{hotel.name}</div>
        <div className="hotel-loc">📍 {hotel.location}</div>
        <div style={{ marginBottom: 10, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {hotel.amenities.slice(0, 2).map(a => <span key={a} className="badge badge-default">{a}</span>)}
        </div>
        <div className="hotel-footer">
          <div className="hotel-price">{fmt(hotel.price)} <small>/ malam</small></div>
          <div style={{ fontSize: 12, color: "var(--g600)" }}>{"★".repeat(hotel.stars)}</div>
        </div>
      </div>
    </div>
  );
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}><Icon d={ICONS.x} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}