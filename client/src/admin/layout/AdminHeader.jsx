import { useState } from "react";

const C = {
  teal: "#0d9f8f",
  tealDark: "#0b8a7c",
  gray: "#64748b",
};

export default function AdminHeader({ title, partner }) {
  const [bellOpen, setBellOpen] = useState(false);
  const [addHovered, setAddHovered] = useState(false);

  const notifications = [
    { id: 1, text: "New partner application from Shopify Wizards", time: "5m ago" },
    { id: 2, text: "Deal 'NovaTech Store' moved to Negotiating", time: "1h ago" },
    { id: 3, text: "Payout cycle due in 3 days — $4,820 pending", time: "2h ago" },
    { id: 4, text: "Stalled deal: BrightCart has no update for 8 days", time: "1d ago" },
  ];

  return (
    <div style={{
      background: "#fff",
      borderBottom: "0.5px solid #e2e8f0",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexShrink: 0,
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{title}</span>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setBellOpen((v) => !v)}
            style={{
              padding: "6px 10px", border: "1px solid #e2e8f0",
              background: "#fff", borderRadius: 7, cursor: "pointer",
              fontSize: 15, position: "relative",
            }}
          >
            🔔
            <span style={{
              position: "absolute", top: -3, right: -3,
              background: "#ef4444", color: "#fff",
              fontSize: 9, fontWeight: 700,
              width: 14, height: 14, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>4</span>
          </button>
          {bellOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 300, background: "#fff",
              border: "0.5px solid #e2e8f0", borderRadius: 10,
              boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
              zIndex: 100,
            }}>
              <div style={{ padding: "10px 14px", borderBottom: "0.5px solid #f1f5f9", fontSize: 12, fontWeight: 600, color: "#0f172a" }}>
                Notifications
              </div>
              {notifications.map((n, i) => (
                <div
                  key={n.id}
                  style={{
                    padding: "10px 14px",
                    borderBottom: i < notifications.length - 1 ? "0.5px solid #f1f5f9" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setBellOpen(false)}
                >
                  <div style={{ fontSize: 12, color: "#0f172a", lineHeight: 1.4 }}>{n.text}</div>
                  <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add partner */}
        <button
          onMouseEnter={() => setAddHovered(true)}
          onMouseLeave={() => setAddHovered(false)}
          style={{
            padding: "7px 14px", fontSize: 12, fontWeight: 500,
            background: addHovered ? C.tealDark : C.teal,
            color: "#fff", border: "none", borderRadius: 7,
            cursor: "pointer", transition: "background 0.15s",
          }}
        >
          + Add Partner
        </button>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: C.teal,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 600,
          }}>
            {(partner?.full_name?.[0] || "A").toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a" }}>{partner?.full_name || "Admin"}</div>
            <div style={{ fontSize: 10, color: C.gray }}>Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
}