import { useState } from "react";
import api from "../../api/axios";

const C = {
  teal: "#0d9f8f",
  tealDark: "#0b8a7c",
  gray: "#64748b",
};

export default function AdminHeader({ title, partner }) {
  const [bellOpen, setBellOpen] = useState(false);
  const [addHovered, setAddHovered] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    agency_name: "",
  });

  const notifications = [
    { id: 1, text: "New partner application from Shopify Wizards", time: "5m ago" },
    { id: 2, text: "Deal 'NovaTech Store' moved to Negotiating", time: "1h ago" },
    { id: 3, text: "Payout cycle due in 3 days — $4,820 pending", time: "2h ago" },
    { id: 4, text: "Stalled deal: BrightCart has no update for 8 days", time: "1d ago" },
  ];

  const closeModal = () => {
    setShowAddPartner(false);
    setForm({ full_name: "", email: "", agency_name: "" });
  };

  const handleAddPartner = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const res = await api.post("/admin/partners", form);

      if (res.data.success) {
        closeModal();
        // Tell the Partners page (or any listener) to refresh its list
        window.dispatchEvent(new Event("partnerAdded"));
        alert("Partner Added Successfully");
      } else {
        alert("Failed to add partner");
      }
    } catch (err) {
      console.log(err);
      alert("Failed to add partner");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
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
      }}
    >
      <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{title}</span>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setBellOpen((v) => !v)}
            style={{
              padding: "6px 10px",
              border: "1px solid #e2e8f0",
              background: "#fff",
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 15,
              position: "relative",
            }}
          >
            🔔
            <span
              style={{
                position: "absolute",
                top: -3,
                right: -3,
                background: "#ef4444",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                width: 14,
                height: 14,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              4
            </span>
          </button>
          {bellOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 300,
                background: "#fff",
                border: "0.5px solid #e2e8f0",
                borderRadius: 10,
                boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                zIndex: 100,
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderBottom: "0.5px solid #f1f5f9",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                Notifications
              </div>
              {notifications.map((n, i) => (
                <div
                  key={n.id}
                  style={{
                    padding: "10px 14px",
                    borderBottom:
                      i < notifications.length - 1 ? "0.5px solid #f1f5f9" : "none",
                    cursor: "pointer",
                  }}
                  onClick={() => setBellOpen(false)}
                >
                  <div style={{ fontSize: 12, color: "#0f172a", lineHeight: 1.4 }}>
                    {n.text}
                  </div>
                  <div style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>{n.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add partner */}
        <button
          onClick={() => setShowAddPartner(true)}
          onMouseEnter={() => setAddHovered(true)}
          onMouseLeave={() => setAddHovered(false)}
          style={{
            padding: "7px 14px",
            fontSize: 12,
            fontWeight: 500,
            background: addHovered ? C.tealDark : C.teal,
            color: "#fff",
            border: "none",
            borderRadius: 7,
            cursor: "pointer",
            transition: "background 0.15s",
          }}
        >
          + Add Partner
        </button>

        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: C.teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {(partner?.full_name?.[0] || "A").toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a" }}>
              {partner?.full_name || "Admin"}
            </div>
            <div style={{ fontSize: 10, color: C.gray }}>Administrator</div>
          </div>
        </div>
      </div>

      {/* Add Partner Modal */}
      {showAddPartner && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              width: 420,
              padding: 25,
              borderRadius: 10,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ marginBottom: 20 }}>Add New Partner</h3>

            <input
              type="text"
              placeholder="Partner Name"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 10,
                border: "1px solid #ddd",
                borderRadius: 6,
              }}
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 10,
                border: "1px solid #ddd",
                borderRadius: 6,
              }}
            />

            <input
              type="text"
              placeholder="Agency Name"
              value={form.agency_name}
              onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
              style={{
                width: "100%",
                padding: 10,
                marginBottom: 20,
                border: "1px solid #ddd",
                borderRadius: 6,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleAddPartner}
                disabled={saving}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  background: "#14b8a6",
                  color: "#fff",
                  cursor: saving ? "default" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Adding..." : "Add Partner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}