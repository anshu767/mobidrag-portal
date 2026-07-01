import { useState } from "react";

const C = {
  teal: "#0d9f8f",
  tealMid: "#11b8a6",
  dark: "#0F0D1A",
  darkHover: "#1a1726",
  darkActive: "#251f35",
  border: "rgba(255,255,255,0.07)",
  text: "rgba(255,255,255,0.55)",
  textActive: "#ffffff",
};

const getAdminDisplayName = (name) => {
  return name === "Anshu Singh" ? "Nigam Shah" : name;
};

const NAV = [
  {
    section: "Overview",
    items: [{ key: "dashboard", label: "Dashboard", icon: "⬛" }],
  },
  {
    section: "Partners",
    items: [
      { key: "applications", label: "Applications", icon: "📋" },
      { key: "partners", label: "All Partners", icon: "👥" },
    ],
  },
  {
    section: "Pipeline",
    items: [
      { key: "deals", label: "All Deals", icon: "🤝" },
      { key: "payouts", label: "Payouts", icon: "💰" },
    ],
  },
  {
    section: "Content",
    items: [
      { key: "resources", label: "Resources", icon: "📁" },
      { key: "training", label: "Training", icon: "🎓" },
    ],
  },
  {
    section: "Configuration",
    items: [{ key: "settings", label: "Program Settings", icon: "⚙️" }],
  },
];

function NavItem({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  const isActive = active === item.key;
  return (
    <button
      onClick={() => onClick(item.key)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        width: "100%",
        padding: "7px 12px",
        background: isActive ? C.darkActive : hovered ? C.darkHover : "transparent",
        border: "none",
        borderRadius: 7,
        cursor: "pointer",
        color: isActive ? C.textActive : C.text,
        fontSize: 13,
        fontWeight: isActive ? 600 : 400,
        textAlign: "left",
        transition: "background 0.15s, color 0.15s",
        position: "relative",
      }}
    >
      {isActive && (
        <div style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
          width: 3,
          height: 18,
          background: C.teal,
          borderRadius: "0 2px 2px 0",
        }} />
      )}
      <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
      {item.label}
    </button>
  );
}

export default function AdminSidebar({ active, setPage, partner, onSignOut }) {
  const [signOutHovered, setSignOutHovered] = useState(false);
  const displayName = getAdminDisplayName(partner?.full_name) || "Admin";

  return (
    <div style={{
      width: 195,
      flexShrink: 0,
      background: C.dark,
      display: "flex",
      flexDirection: "column",
      height: "100%",
      overflow: "hidden",
      borderRight: `1px solid ${C.border}`,
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, background: C.teal, borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 15,
          }}>M</div>
          <div>
            <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>MobiDrag</div>
            <div style={{
              fontSize: 9, color: "rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.07)",
              padding: "1px 6px", borderRadius: 6, display: "inline-block", marginTop: 1,
            }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
        {NAV.map((group) => (
          <div key={group.section} style={{ marginBottom: 18 }}>
            <div style={{
              fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.25)", padding: "0 12px", marginBottom: 4,
              textTransform: "uppercase",
            }}>
              {group.section}
            </div>
            {group.items.map((item) => (
              <NavItem key={item.key} item={item} active={active} onClick={setPage} />
            ))}
          </div>
        ))}
      </div>

      {/* Admin footer */}
      <div style={{ padding: "12px 12px 14px", borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: C.teal,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 600, flexShrink: 0,
          }}>
            {(displayName?.[0] || "A").toUpperCase()}
          </div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {displayName}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Administrator</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          onMouseEnter={() => setSignOutHovered(true)}
          onMouseLeave={() => setSignOutHovered(false)}
          style={{
            width: "100%", padding: "6px 0", fontSize: 12,
            background: signOutHovered ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 7, color: signOutHovered ? "#ef4444" : "rgba(255,255,255,0.4)",
            cursor: "pointer", transition: "all 0.15s",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}