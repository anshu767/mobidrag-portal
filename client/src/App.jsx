import { useState, useEffect } from "react";
import React from "react";
import api from "./api/axios";
import AdminApp from "./admin/AdminApp";
import AgreementModal from "./components/AgreementModal";
// ─── Color tokens — MobiDrag brand (exact teal from mobidrag.com) ─────────────
const C = {
  teal: "#0d9f8f",
  tealDark: "#0b8a7c",
  tealLight: "#e6f7f5",
  tealMid: "#11b8a6",
  dark: "#0f172a",
  darkCard: "#1e293b",
  darkBorder: "rgba(255,255,255,0.08)",
  green: "#10b981",
  greenLight: "#d1fae5",
  greenText: "#065f46",
  amber: "#f59e0b",
  amberLight: "#fef3c7",
  amberText: "#92400e",
  blue: "#3b82f6",
  blueLight: "#dbeafe",
  blueText: "#1e40af",
  red: "#ef4444",
  redLight: "#fee2e2",
  redText: "#991b1b",
  purple: "#8b5cf6",
  purpleLight: "#ede9fe",
  purpleText: "#5b21b6",
  gray: "#64748b",
  grayLight: "#f1f5f9",
};

const STAGE_LABELS = ["Contacted", "Demo scheduled", "Demo done", "Negotiating", "Won"];

const stageToNum = (s) => {
  if (typeof s === "number") return s;
  const i = STAGE_LABELS.indexOf(s);
  return i >= 0 ? i + 1 : 1;
};

const stageBadge = (stage) => {
  const stageNum = stageToNum(stage);
  const map = [
    { bg: C.grayLight, color: C.gray },
    { bg: C.amberLight, color: C.amberText },
    { bg: C.blueLight, color: C.blueText },
    { bg: C.purpleLight, color: C.purpleText },
    { bg: C.greenLight, color: C.greenText },
  ];
  const s = map[stageNum - 1] || map[0];
  return { background: s.bg, color: s.color, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 500, display: "inline-flex", alignItems: "center" };
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ name, bg = C.teal, size = 34 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: size * 0.38, fontWeight: 600, flexShrink: 0 }}>
      {name?.[0]?.toUpperCase()}
    </div>
  );
}

function InfoRow({ label, value, accent }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: `0.5px solid ${C.grayLight}` }}>
      <span style={{ fontSize: 12, color: C.gray, minWidth: 120, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: accent ? C.teal : "#1e293b", wordBreak: "break-all" }}>{value}</span>
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", border: `0.5px solid #e2e8f0`, borderRadius: 10, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

// ─── Screen: Login ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onApply, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

const handleSignIn = async () => {
  setError("");

  if (!email || !password) {
    setError("Please enter your email and password.");
    return;
  }

  setLoading(true);

  try {
    const res = await api.post("/auth/login", { email, password });
    const data = res.data;

    if (data.success) {
      // Login user
      onLogin(data.partner);

      // Save role (for future use)
      localStorage.setItem("userRole", data.partner.role);

      // Check if Admin
      if (data.partner.role === "admin") {
        console.log("✅ Admin Login");
      } else {
        console.log("✅ Partner Login");
      }
    } else {
      setError(data.message || "Invalid email or password");
    }
  } catch (err) {
    console.error("Login request failed:", err);
    setError("Could not connect to server. Please try again.");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ flex: 1, background: C.dark, padding: 32, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
            <div style={{ width: 32, height: 32, background: C.teal, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16 }}>M</div>
            <span style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>MobiDrag</span>
            <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>Partner Portal</span>
          </div>
          <div style={{ color: "#fff", fontSize: 22, fontWeight: 600, lineHeight: 1.4, marginBottom: 10 }}>Grow revenue selling<br />MobiDrag to Shopify brands</div>
          <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, lineHeight: 1.7, marginBottom: 24 }}>Track deals, earn commissions,<br />access resources in one hub.</div>
          {["Track every referred deal in real-time", "Earn 10–15% commission per app sold", "Exclusive sales decks and training", "Automated monthly payouts"].map((t) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: `rgba(13,159,143,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 10, color: C.tealMid }}>✓</span>
              </div>
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>{t}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          {[{ tier: "Platinum Partner", name: "Shopify Wizards", earn: "$12.4K" }, { tier: "Gold Partner", name: "Ecom Growth Studio", earn: "$8.2K" }].map((p) => (
            <div key={p.name} style={{ background: "rgba(255,255,255,0.06)", border: `0.5px solid rgba(255,255,255,0.1)`, borderRadius: 10, padding: 12, flex: 1 }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 2 }}>{p.tier}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#fff" }}>{p.name}</div>
              <div style={{ fontSize: 19, fontWeight: 600, color: C.tealMid, marginTop: 3 }}>{p.earn}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: 360, display: "flex", alignItems: "center", justifyContent: "center", padding: 28, background: "#f8fafc" }}>
        <div style={{ width: "100%" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 42, height: 42, background: C.teal, borderRadius: 9, display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 10 }}>M</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a" }}>Partner sign in</div>
            <div style={{ fontSize: 13, color: C.gray, marginTop: 3 }}>MobiDrag Partner Hub</div>
          </div>
          <div style={{ marginBottom: 13 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 5 }}>Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="partner@example.com"
              style={{ width: "100%", padding: "8px 11px", fontSize: 13, border: `1px solid ${error ? C.red : "#cbd5e1"}`, borderRadius: 8, background: "#fff", outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ marginBottom: 4 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 5 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSignIn()}
              placeholder="Enter password"
              style={{ width: "100%", padding: "8px 11px", fontSize: 13, border: `1px solid ${error ? C.red : "#cbd5e1"}`, borderRadius: 8, background: "#fff", outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ textAlign: "right", marginTop: 5 }}>
              <span style={{ fontSize: 12, color: C.teal, cursor: "pointer" }} onClick={onForgot}>Forgot password?</span>
            </div>
          </div>
          {error && (
            <div style={{ background: C.redLight, color: C.redText, fontSize: 12, padding: "8px 11px", borderRadius: 7, marginBottom: 8 }}>
              {error}
            </div>
          )}
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{ width: "100%", padding: "10px", fontSize: 14, fontWeight: 600, background: loading ? C.gray : C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: loading ? "not-allowed" : "pointer", marginTop: 8 }}
          >
            {loading ? "Signing in…" : "Sign in to Partner Portal"}
          </button>
          <div style={{ textAlign: "center", marginTop: 13, fontSize: 12, color: C.gray }}>
            Not a partner? <span style={{ color: C.teal, cursor: "pointer" }} onClick={onApply}>Apply to join</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ active, setTab, onSignOut }) {
  const links = [
    { id: "home", icon: "⊞", label: "Dashboard", section: "Main" },
    { id: "deals", icon: "📁", label: "Refer Clients", section: null },
    { id: "reg", icon: "+", label: "Register Deal", section: null },
    { id: "comm", icon: "₹", label: "Commissions", section: "Earnings" },
    { id: "res", icon: "📄", label: "Resources", section: "Learn" },
    { id: "train", icon: "🎓", label: "Training", section: null },
    { id: "profile", icon: "👤", label: "Profile", section: "Account" },
  ];
  let lastSection = null;
  return (
    <div style={{ width: 190, minWidth: 190, background: C.dark, display: "flex", flexDirection: "column", height: "100%", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ padding: "16px 14px 12px", borderBottom: `0.5px solid ${C.darkBorder}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 27, height: 27, background: C.teal, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>M</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>MobiDrag</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>Partner Portal</div>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {links.map((l) => {
          const showSection = l.section && l.section !== lastSection;
          if (showSection) lastSection = l.section;
          const isActive = active === l.id || (active === "deal-view" && l.id === "deals");
          return (
            <div key={l.id}>
              {showSection && <div style={{ padding: "12px 14px 3px", fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.8px" }}>{l.section.toUpperCase()}</div>}
              <div onClick={() => setTab(l.id)} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", margin: "1px 6px", borderRadius: 6, cursor: "pointer", color: isActive ? C.tealMid : "rgba(255,255,255,0.5)", background: isActive ? `rgba(13,159,143,0.2)` : "transparent", fontSize: 13, transition: "all 0.15s" }}>
                <span style={{ fontSize: 14, width: 16, textAlign: "center" }}>{l.icon}</span>
                {l.label}
                {l.badge && <span style={{ marginLeft: "auto", background: `rgba(13,159,143,0.4)`, color: C.tealMid, fontSize: 10, padding: "2px 5px", borderRadius: 8 }}>{l.badge}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: "10px 6px", borderTop: `0.5px solid ${C.darkBorder}` }}>
        <div onClick={onSignOut} style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 6, cursor: "pointer", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
          <span>↩</span> Sign out
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Tab ────────────────────────────────────────────────────────────
function Dashboard({ setTab, setViewDeal }) {
  const [dashboardData, setDashboardData] = useState({
    activePartners: 0,
    pendingApprovals: 0,
    monthlyLeads: 0,
    monthlyEarned: 0,
    monthlyTarget: 3000,
  });
  const [recentDeals, setRecentDeals] = useState([]);
  const [dashCopied, setDashCopied] = useState(false);

  useEffect(() => {
    fetchDashboard();
    fetchDeals();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get("/dashboard");
      setDashboardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDeals = async () => {
    try {
      const response = await api.get("/deals");
      if (response.data.success) setRecentDeals(response.data.deals);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDashCopy = () => {
    const link = `mobidrag.com/ref/${dashboardData.partner?.agency_name?.toLowerCase().replace(/\s+/g, "") || ""}`;
    navigator.clipboard.writeText(link).then(() => {
      setDashCopied(true);
      setTimeout(() => setDashCopied(false), 2000);
    }).catch(() => {});
  };

  const earned = dashboardData.monthlyEarned || 0;
  const target = dashboardData.monthlyTarget || 3000;
  const progressPct = Math.min(100, Math.round((earned / target) * 100));
  const toGo = Math.max(0, target - earned);

  const stats = [
    { label: "Active Partners",    value: dashboardData.activePartners,  sub: "From database", color: C.teal  },
    { label: "Pending Approvals",  value: dashboardData.pendingApprovals, sub: "Live data",     color: C.green },
    { label: "Monthly Leads",      value: dashboardData.monthlyLeads,     sub: "This month",    color: C.teal  },
    { label: "Partner Tier",       value: dashboardData.partner?.tier || "-", sub: "Database",  color: C.amber },
  ];

  return (
    <div style={{ padding: 20, overflowY: "auto", height: "100%", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {/* Banner */}
      <div style={{ background: C.dark, borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `rgba(13,159,143,0.2)`, padding: "3px 10px", borderRadius: 20, fontSize: 11, color: C.tealMid, marginBottom: 8 }}>
          👑 {dashboardData.partner?.tier || "Loading"} Partner
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#fff", marginBottom: 2 }}>Good morning, {dashboardData.partner?.full_name || "Loading"} 👋</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>You are in the top 3 partners this month</div>
        <div style={{ background: "rgba(255,255,255,0.07)", border: `0.5px solid rgba(255,255,255,0.12)`, borderRadius: 7, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: C.tealMid, fontFamily: "monospace" }}>mobidrag.com/ref/{dashboardData.partner?.agency_name?.toLowerCase().replace(/\s+/g, "") || "loading"}</span>
          <span onClick={handleDashCopy} style={{ fontSize: 11, color: dashCopied ? C.green : "rgba(255,255,255,0.4)", cursor: "pointer" }}>{dashCopied ? "✅ Copied" : "📋 Copy"}</span>
        </div>
      </div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", border: `0.5px solid #e2e8f0`, borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: C.gray, marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 1 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      {/* Progress */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <Card>
          <div style={{ padding: "12px 14px", borderBottom: `0.5px solid #f1f5f9`, fontSize: 13, fontWeight: 500, color: "#0f172a" }}>Monthly target</div>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.gray, marginBottom: 5 }}>
              <span>${earned.toLocaleString()} earned</span>
              <span>${target.toLocaleString()} target</span>
            </div>
            <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: C.teal, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: C.teal, marginTop: 4 }}>
              {progressPct}% of target · ${toGo.toLocaleString()} to go
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ padding: "12px 14px", borderBottom: `0.5px solid #f1f5f9`, fontSize: 13, fontWeight: 500, color: "#0f172a" }}>Partner tier</div>
          <div style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.gray, marginBottom: 5 }}><span>Platinum</span><span>15% commission</span></div>
            <div style={{ height: 6, background: "#f1f5f9", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "85%", background: C.green, borderRadius: 3 }} />
            </div>
            <div style={{ fontSize: 11, color: C.green, marginTop: 4 }}>Top tier — keep closing!</div>
          </div>
        </Card>
      </div>
      {/* Recent deals */}
      <Card>
        <div style={{ padding: "12px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>Recent deals</span>
          <span style={{ fontSize: 12, color: C.teal, cursor: "pointer" }} onClick={() => setTab("deals")}>View all →</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Brand", "Plan", "Stage", "Commission", "Date"].map((h) => (
                <th key={h} style={{ padding: "8px 13px", textAlign: "left", fontSize: 11, color: C.gray, fontWeight: 500, borderBottom: `0.5px solid #e2e8f0` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentDeals.slice(0, 5).map((d) => (
              <tr key={d.id} style={{ cursor: "pointer" }} onClick={() => { setViewDeal(d.id); setTab("deal-view"); }}>
                <td style={{ padding: "10px 13px", fontSize: 13, color: "#0f172a", borderBottom: `0.5px solid #f1f5f9` }}>
                  <div style={{ fontWeight: 500 }}>{d.brand_name}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>{d.shopify_store_url}</div>
                </td>
                <td style={{ padding: "10px 13px", fontSize: 13, color: C.teal, fontWeight: 500, borderBottom: `0.5px solid #f1f5f9` }}>{d.plan}</td>
                <td style={{ padding: "10px 13px", borderBottom: `0.5px solid #f1f5f9` }}><span style={stageBadge(d.stage)}>{STAGE_LABELS[stageToNum(d.stage) - 1]}</span></td>
                <td style={{ padding: "10px 13px", fontSize: 13, color: C.green, fontWeight: 500, borderBottom: `0.5px solid #f1f5f9` }}>{d.commission_amount}</td>
                <td style={{ padding: "10px 13px", fontSize: 12, color: C.gray, borderBottom: `0.5px solid #f1f5f9` }}>{d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Deals List Tab ───────────────────────────────────────────────────────────
function DealsTab({ setTab, setViewDeal }) {
  const [filter, setFilter] = useState("All");
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const stages = ["All", "Contacted", "Demo scheduled", "Demo done", "Negotiating", "Won"];

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const response = await api.get('/deals');
      const data = response.data;
      if (data.success) {
        setDeals(data.deals);
      } else {
        setFetchError("Failed to load deals.");
      }
    } catch (error) {
      console.error(error);
      setFetchError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = deals.filter(
    (d) => filter === "All" || STAGE_LABELS[stageToNum(d.stage) - 1] === filter
  );

  return (
    <div style={{ padding: 20, overflowY: "auto", height: "100%", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {stages.map((s) => (
          <span key={s} onClick={() => setFilter(s)} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, border: `1px solid ${filter === s ? C.teal : "#cbd5e1"}`, background: filter === s ? C.tealLight : "#fff", color: filter === s ? C.tealDark : C.gray, cursor: "pointer", fontWeight: filter === s ? 500 : 400 }}>
            {s}
          </span>
        ))}
      </div>
      <Card>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Brand", "Plan", "Stage", "Commission", "Date", ""].map((h) => (
                <th key={h} style={{ padding: "9px 13px", textAlign: "left", fontSize: 11, color: C.gray, fontWeight: 500, borderBottom: `0.5px solid #e2e8f0` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: "16px 13px", fontSize: 13, color: C.gray }}>Loading deals...</td></tr>
            ) : fetchError ? (
              <tr><td colSpan={6} style={{ padding: "16px 13px", fontSize: 13, color: C.redText, background: C.redLight }}>{fetchError}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: "16px 13px", fontSize: 13, color: C.gray }}>No deals found.</td></tr>
            ) : filtered.map((d) => (
              <tr key={d.id} onClick={() => { setViewDeal(d.id); setTab("deal-view"); }} style={{ cursor: "pointer" }}>
                <td style={{ padding: "10px 13px", borderBottom: `0.5px solid #f1f5f9` }}>
                  <div style={{ fontWeight: 500, fontSize: 13, color: "#0f172a" }}>{d.brand_name}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>{d.shopify_store_url}</div>
                </td>
                <td style={{ padding: "10px 13px", fontSize: 13, color: C.teal, fontWeight: 500, borderBottom: `0.5px solid #f1f5f9` }}>{d.plan}</td>
                <td style={{ padding: "10px 13px", borderBottom: `0.5px solid #f1f5f9` }}>
                  <span style={stageBadge(d.stage)}>{STAGE_LABELS[stageToNum(d.stage) - 1]}</span>
                </td>
                <td style={{ padding: "10px 13px", fontSize: 13, color: C.green, fontWeight: 500, borderBottom: `0.5px solid #f1f5f9` }}>₹{d.commission_amount}</td>
                <td style={{ padding: "10px 13px", fontSize: 12, color: C.gray, borderBottom: `0.5px solid #f1f5f9` }}>{new Date(d.created_at).toLocaleDateString()}</td>
                <td style={{ padding: "10px 13px", borderBottom: `0.5px solid #f1f5f9` }}>
                  <button onClick={(e) => { e.stopPropagation(); setViewDeal(d.id); setTab("deal-view"); }} style={{ fontSize: 11, padding: "4px 10px", borderRadius: 6, border: `1px solid #cbd5e1`, background: "#fff", cursor: "pointer", color: "#0f172a" }}>
                    👁 View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Send Email Modal ─────────────────────────────────────────────────────────
function SendEmailModal({ defaultTo, dealBrand, onClose }) {
  const [to, setTo] = useState(defaultTo || "");
  const [subject, setSubject] = useState(
    `Following up on MobiDrag app for ${dealBrand || "your store"}`
  );
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSend = async () => {
    if (!to || !subject || !message) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setErrorMsg("");
    setStatus("sending");

    try {
      const res = await api.post("/send-email", {
        to,
        subject,
        message,
      });

      const data = res.data;

      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.message || "Failed to send email.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Could not connect to server.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 22,
          width: 420,
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#0f172a",
            }}
          >
            ✉️ Send Email
          </span>

          <span
            onClick={onClose}
            style={{
              cursor: "pointer",
              fontSize: 18,
              color: C.gray,
            }}
          >
            ×
          </span>
        </div>

        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: C.green,
              }}
            >
              Email sent successfully!
            </div>

            <button
              onClick={onClose}
              style={{
                marginTop: 16,
                padding: "7px 18px",
                background: C.teal,
                color: "#fff",
                border: "none",
                borderRadius: 7,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {[
              ["To", to, setTo, "email"],
              ["Subject", subject, setSubject, "text"],
            ].map(([label, val, setter, type]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: C.gray,
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  {label}
                </label>

                <input
                  type={type}
                  value={val}
                  onChange={(e) => setter(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "8px 10px",
                    fontSize: 13,
                    border: "1px solid #cbd5e1",
                    borderRadius: 7,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: C.gray,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Message
              </label>

              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  fontSize: 13,
                  border: "1px solid #cbd5e1",
                  borderRadius: 7,
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {errorMsg && (
              <div
                style={{
                  background: C.redLight,
                  color: C.redText,
                  fontSize: 12,
                  padding: "7px 10px",
                  borderRadius: 6,
                  marginBottom: 10,
                }}
              >
                {errorMsg}
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: "7px 14px",
                  border: "1px solid #cbd5e1",
                  background: "#fff",
                  borderRadius: 7,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                disabled={status === "sending"}
                style={{
                  padding: "7px 16px",
                  background:
                    status === "sending" ? C.gray : C.teal,
                  color: "#fff",
                  border: "none",
                  borderRadius: 7,
                  cursor:
                    status === "sending"
                      ? "not-allowed"
                      : "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {status === "sending"
                  ? "Sending..."
                  : "Send"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Deal Detail Tab ──────────────────────────────────────────────────────────
function DealDetail({ dealKey, onStageChange }) {
  const [d, setD] = useState(null);
  const [showStageMenu, setShowStageMenu] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const loadDeal = () => {
    if (!dealKey) return;
    api.get("/deals")
      .then((r) => {
        const data = r.data;
        if (data.success) {
          const found = data.deals.find((deal) => deal.id === dealKey);
          if (found) setD(found);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadDeal();
  }, [dealKey]);

  const updateStage = async (newStageLabel) => {
    setUpdatingStage(true);
    try {
      const response = await api.put(`/deals/${dealKey}/stage`, {
        stage: newStageLabel,
      });
      const result = response.data;
      if (result.success) {
        setD((prev) => ({ ...prev, stage: newStageLabel }));
        if (onStageChange) onStageChange();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStage(false);
      setShowStageMenu(false);
    }
  };

  if (!d) return <div style={{ padding: 20, color: C.gray, fontSize: 13 }}>Loading...</div>;

  const brand = d.brand_name;
  const url = d.shopify_store_url;
  const dealId = d.deal_id || `#MBD-${d.id}`;
  const date = d.created_at ? new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
  const stage = stageToNum(d.stage);
  const plan = d.plan;
  const comm = d.commission_amount;
  const industry = d.industry || "";
  const orders = d.monthly_orders || "";
  const revenue = d.monthly_revenue || "";
  const mobile = d.mobile_traffic || "";
  const hasapp = d.has_app || "";
  const contact = d.contact_name || "";
  const role = d.contact_role || "";
  const email = d.contact_email || "";
  const phone = d.contact_phone || "";
  const linkedin = d.contact_linkedin || "";
  const time = d.best_time || "";
  const notes = d.notes || "";
  const reasons = Array.isArray(d.reasons)
    ? d.reasons
    : d.reasons
    ? d.reasons.split(",").map((r) => r.trim()).filter(Boolean)
    : [];

  const stageIcons = ["📬", "📅", "👁", "💬", "🏆"];
  return (
    <div style={{ padding: 20, overflowY: "auto", height: "100%", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {showEmailModal && (
        <SendEmailModal
          defaultTo={email}
          dealBrand={brand}
          onClose={() => setShowEmailModal(false)}
        />
      )}
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
            <span style={{ fontSize: 19, fontWeight: 600, color: "#0f172a" }}>{brand}</span>
            <span style={stageBadge(stage)}>{STAGE_LABELS[stage - 1]}</span>
          </div>
          <div style={{ fontSize: 13, color: C.gray }}>🌐 {url} &nbsp;·&nbsp; {dealId} &nbsp;·&nbsp; Submitted {date}</div>
        </div>
        <div style={{ display: "flex", gap: 8, position: "relative" }}>
          <button onClick={() => setShowEmailModal(true)} style={{ padding: "7px 13px", borderRadius: 8, border: `1px solid #cbd5e1`, background: "#fff", cursor: "pointer", fontSize: 13 }}>✉️ Send email</button>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowStageMenu((v) => !v)}
              disabled={updatingStage}
              style={{ padding: "7px 13px", borderRadius: 8, border: `none`, background: C.teal, color: "#fff", cursor: updatingStage ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500, opacity: updatingStage ? 0.7 : 1 }}
            >
              {stage === 5 ? "✅ Won — active" : stage >= 3 ? "🔄 Update stage" : "📅 Schedule demo"}
            </button>
            {showStageMenu && (
              <div style={{ position: "absolute", right: 0, top: "110%", background: "#fff", border: `1px solid #e2e8f0`, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.10)", zIndex: 50, minWidth: 180, overflow: "hidden" }}>
                {STAGE_LABELS.map((label, i) => (
                  <div
                    key={label}
                    onClick={() => updateStage(label)}
                    style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer", color: i + 1 === stage ? C.teal : "#0f172a", fontWeight: i + 1 === stage ? 600 : 400, background: i + 1 === stage ? C.tealLight : "#fff", borderBottom: i < 4 ? `0.5px solid #f1f5f9` : "none" }}
                  >
                    {i + 1 === stage ? "✓ " : ""}{label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stage pipeline */}
      <Card style={{ padding: "14px 18px", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.gray, marginBottom: 12 }}>Deal stage</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {STAGE_LABELS.map((label, i) => {
            const n = i + 1;
            const isDone = n < stage;
            const isCurrent = n === stage;
            return (
              <div key={n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, border: `2px solid ${isDone ? C.green : isCurrent ? C.teal : "#cbd5e1"}`, background: isDone ? C.green : isCurrent ? C.teal : "#fff", color: isDone || isCurrent ? "#fff" : C.gray }}>
                    {isDone ? "✓" : stageIcons[i]}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 5, color: isDone ? C.green : isCurrent ? C.teal : C.gray, fontWeight: isCurrent ? 500 : 400, textAlign: "center" }}>{label}</div>
                </div>
                {i < 4 && <div style={{ flex: 1, height: 2, background: n < stage ? C.green : "#e2e8f0", marginTop: -17, marginLeft: -1, marginRight: -1 }} />}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Left */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 9, color: "#0f172a" }}>Brand details</div>
          <Card style={{ padding: "12px 14px", marginBottom: 13 }}>
            <InfoRow label="Store URL" value={url} accent />
            <InfoRow label="Industry" value={industry} />
            <InfoRow label="Monthly orders" value={orders} />
            <InfoRow label="Monthly revenue" value={revenue} />
            <InfoRow label="Mobile traffic" value={mobile} />
            <InfoRow label="Has app today?" value={hasapp} />
          </Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 9, color: "#0f172a" }}>Contact person</div>
          <Card style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Avatar name={contact} bg={C.teal} size={38} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{contact}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{role}</div>
              </div>
            </div>
            <InfoRow label="✉️ Email" value={email} accent />
            <InfoRow label="💬 WhatsApp" value={phone} />
            <InfoRow label="🔗 LinkedIn" value={linkedin} accent />
            <InfoRow label="🕐 Best time" value={time} />
          </Card>
        </div>
        {/* Right */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 9, color: "#0f172a" }}>Commission summary</div>
          <Card style={{ padding: "12px 14px", marginBottom: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: C.gray }}>Recommended plan</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.teal }}>{plan}</span>
            </div>
            <div style={{ height: "0.5px", background: "#e2e8f0", marginBottom: 10 }} />
            {[["Your tier rate", "15% (Platinum)"], ["Expected commission", comm ? `$${comm}/mo` : "—"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span style={{ color: C.gray }}>{k}</span>
                <span style={{ fontWeight: 500, color: k === "Expected commission" ? C.green : "#0f172a" }}>{v}</span>
              </div>
            ))}
          </Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 9, color: "#0f172a" }}>Why they need an app</div>
          <Card style={{ padding: "10px 13px", marginBottom: 13 }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {reasons.length > 0 ? reasons.map((r) => (
                <span key={r} style={{ ...stageBadge(4), background: C.purpleLight, color: C.purpleText }}>{r}</span>
              )) : <span style={{ fontSize: 12, color: C.gray }}>—</span>}
            </div>
          </Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 9, color: "#0f172a" }}>Your private notes</div>
          <Card style={{ padding: "12px 14px", marginBottom: 13 }}>
            <p style={{ fontSize: 13, color: C.gray, lineHeight: 1.6, margin: 0 }}>{notes || "—"}</p>
          </Card>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 9, color: "#0f172a" }}>Activity log</div>
          <Card style={{ padding: "12px 14px" }}>
            {[
              { dot: C.teal, text: "Demo scheduled for June 10", date: "Jun 5, 2025" },
              { dot: C.green, text: "Deal registered by Rahul Mehta", date: "Jun 1, 2025" },
              { dot: C.blue, text: "MobiDrag team reached out to contact", date: "Jun 2, 2025" },
            ].map((a) => (
              <div key={a.text} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `0.5px solid #f1f5f9` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.dot, flexShrink: 0, marginTop: 4 }} />
                <div>
                  <div style={{ fontSize: 13, color: "#0f172a" }}>{a.text}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>{a.date}</div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Register Deal (4-step) ───────────────────────────────────────────────────
function RegisterDeal() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const steps = ["Brand info", "Contact", "Qualify", "Plan"];
  const [form, setForm] = useState({ url: "", brand: "", industry: "Apparel and Fashion", orders: "", revenue: "", hasApp: "No app yet", contact: "", role: "", email: "", phone: "", linkedin: "", time: "", mobile: "", reasons: [], notes: "", plan: "" });

  const submitDeal = async () => {
    setSubmitting(true);
    try {
      await api.post("/deals", {
        shopify_store_url: form.url,
        brand_name: form.brand,
        industry: form.industry,
        monthly_orders: form.orders,
        monthly_revenue: form.revenue,
        has_app: form.hasApp,
        contact_name: form.contact,
        contact_role: form.role,
        contact_email: form.email,
        contact_phone: form.phone,
        contact_linkedin: form.linkedin,
        best_time: form.time,
        mobile_traffic: form.mobile,
        reasons: form.reasons,
        notes: form.notes,
        plan: form.plan,
        stage: 1,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
      setStep(5);
    }
  };

  if (step === 5) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Deal registered!</div>
        <div style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>MobiDrag team will reach out within 24 hours.</div>
        <button onClick={() => setStep(1)} style={{ padding: "9px 20px", background: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500 }}>Register another deal</button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", height: "100%", display: "flex", flexDirection: "column", background: "#f8fafc" }}>
      <div style={{ background: "#fff", borderBottom: `0.5px solid #e2e8f0`, padding: "14px 20px" }}>
        <div style={{ fontSize: 12, color: C.gray, marginBottom: 12 }}>Register a new Shopify brand deal</div>
        <div style={{ display: "flex", alignItems: "center" }}>
          {steps.map((s, i) => {
            const n = i + 1;
            const done = n < step;
            const cur = n === step;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 3 ? 1 : 0 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, border: `1.5px solid ${done ? C.green : cur ? C.teal : "#cbd5e1"}`, background: done ? C.green : cur ? C.teal : "transparent", color: done || cur ? "#fff" : C.gray, flexShrink: 0 }}>
                  {done ? "✓" : n}
                </div>
                <span style={{ fontSize: 11, color: cur ? C.teal : C.gray, margin: "0 8px" }}>{s}</span>
                {i < 3 && <div style={{ flex: 1, height: 1, background: done ? C.green : "#e2e8f0" }} />}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ padding: "20px", maxWidth: 540, overflowY: "auto", flex: 1 }}>
        {step === 1 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, color: "#0f172a" }}>Brand information</div>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 18 }}>Tell us about the Shopify brand you are referring</div>
            {[["Shopify store URL", "url", "https://storename.myshopify.com"], ["Brand name", "brand", "Brand name"]].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: 13 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 5 }}>{label}</label>
                <input placeholder={ph} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", padding: "8px 11px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 8, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 13 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 5 }}>Monthly orders</label>
                <input placeholder="e.g. 500–1000" value={form.orders} onChange={(e) => setForm({ ...form, orders: e.target.value })} style={{ width: "100%", padding: "8px 11px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 8, outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 5 }}>Monthly revenue</label>
                <input placeholder="e.g. ₹10 Lakh" value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} style={{ width: "100%", padding: "8px 11px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 8, outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setStep(2)} style={{ padding: "8px 16px", background: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Next: Contact details →</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, color: "#0f172a" }}>Decision maker contact</div>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 18 }}>Who should MobiDrag talk to?</div>
            {[["Contact name", "contact", "e.g. Priya Sharma"], ["Role / Title", "role", "e.g. Founder, Co-founder"], ["Work email", "email", "priya@brand.com"], ["WhatsApp", "phone", "+91 98765 43210"]].map(([label, key, ph]) => (
              <div key={key} style={{ marginBottom: 13 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 5 }}>{label}</label>
                <input placeholder={ph} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", padding: "8px 11px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 8, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <button onClick={() => setStep(1)} style={{ padding: "8px 14px", border: `1px solid #cbd5e1`, background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>← Back</button>
              <button onClick={() => setStep(3)} style={{ padding: "8px 16px", background: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Next: Qualify →</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, color: "#0f172a" }}>Qualify the opportunity</div>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 18 }}>Help MobiDrag prepare the right pitch</div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 8 }}>Why do they need an app?</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["High repeat customers", "Growing mobile traffic", "Push notifications", "Reduce cart abandonment", "Brand loyalty program", "Competitors have apps", "Increase AOV"].map((r) => (
                  <span key={r} style={{ padding: "4px 10px", borderRadius: 20, fontSize: 12, border: `1px solid ${form.reasons.includes(r) ? C.teal : "#cbd5e1"}`, background: form.reasons.includes(r) ? C.tealLight : "#fff", color: form.reasons.includes(r) ? C.tealDark : C.gray, cursor: "pointer" }}
                    onClick={() => setForm({ ...form, reasons: form.reasons.includes(r) ? form.reasons.filter((x) => x !== r) : [...form.reasons, r] })}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 13 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 5 }}>Your private notes</label>
              <textarea rows={3} placeholder="What did they say? Any objections? Key decision factors..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ width: "100%", padding: "8px 11px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 8, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button onClick={() => setStep(2)} style={{ padding: "8px 14px", border: `1px solid #cbd5e1`, background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>← Back</button>
              <button onClick={() => setStep(4)} style={{ padding: "8px 16px", background: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Next: Choose plan →</button>
            </div>
          </div>
        )}
        {step === 4 && (
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, color: "#0f172a" }}>Recommended plan</div>
            <div style={{ fontSize: 13, color: C.gray, marginBottom: 18 }}>Which MobiDrag plan fits this brand?</div>
            {[{ id: "basic", name: "Basic", price: "$199/mo", comm: "$358/mo", desc: "Small stores, up to 500 orders/mo" }, { id: "starter", name: "Starter", price: "$299/mo", comm: "$538/mo", desc: "Growing stores, 500–1000 orders/mo" }, { id: "growth", name: "Growth", price: "$499/mo", comm: "$898/mo", desc: "Scaling brands, 1000+ orders/mo" }].map((p) => (
              <div key={p.id} onClick={() => setForm({ ...form, plan: p.id })} style={{ border: `1.5px solid ${form.plan === p.id ? C.teal : "#e2e8f0"}`, borderRadius: 10, padding: 13, cursor: "pointer", marginBottom: 10, background: form.plan === p.id ? C.tealLight : "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{p.name} — {p.price}</span>
                  <span style={{ fontSize: 13, color: C.green, fontWeight: 500 }}>You earn {p.comm}</span>
                </div>
                <div style={{ fontSize: 12, color: C.gray, marginTop: 4 }}>{p.desc}</div>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
              <button onClick={() => setStep(3)} style={{ padding: "8px 14px", border: `1px solid #cbd5e1`, background: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>← Back</button>
              <button onClick={submitDeal} disabled={submitting} style={{ padding: "9px 20px", background: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: submitting ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600, opacity: submitting ? 0.7 : 1 }}>{submitting ? "Submitting..." : "✓ Submit deal"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Commissions Tab ──────────────────────────────────────────────────────────
function CommissionsTab() {
  const [commData, setCommData] = useState({ totalEarned: 0, pendingPayout: 0, avgPerDeal: 0, history: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/commissions")
      .then((r) => { setCommData(r.data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  const fmt = (n) => `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  const totalDeals = commData.history.length;

  return (
    <div style={{ padding: 20, overflowY: "auto", height: "100%", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
        {[
          { label: "Total earned", value: loading ? "..." : fmt(commData.totalEarned), sub: "Won deals", color: C.teal },
          { label: "Pending payout", value: loading ? "..." : fmt(commData.pendingPayout), sub: "Next: 1st of month", color: C.amber },
          { label: "Avg per deal", value: loading ? "..." : fmt(commData.avgPerDeal), sub: `${totalDeals} deals total`, color: C.green },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", border: `0.5px solid #e2e8f0`, borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: C.gray }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: C.gray, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <Card>
        <div style={{ padding: "12px 14px", borderBottom: `0.5px solid #f1f5f9`, fontSize: 13, fontWeight: 500, color: "#0f172a" }}>Commission history</div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {["Brand", "Plan", "Monthly", "Status", "Payout date"].map((h) => (
                <th key={h} style={{ padding: "8px 13px", textAlign: "left", fontSize: 11, color: C.gray, fontWeight: 500, borderBottom: `0.5px solid #e2e8f0` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: "16px 13px", fontSize: 13, color: C.gray }}>Loading...</td></tr>
            ) : commData.history.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: "16px 13px", fontSize: 13, color: C.gray }}>No commission data yet.</td></tr>
            ) : commData.history.map((r, idx) => {
              const payoutDate = r.status === "Paid"
                ? (r.created_at ? new Date(new Date(r.created_at).setMonth(new Date(r.created_at).getMonth() + 1)).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—")
                : "Next payout";
              const planLabel = r.plan ? r.plan.charAt(0).toUpperCase() + r.plan.slice(1) : "—";
              return (
                <tr key={idx}>
                  <td style={{ padding: "10px 13px", fontSize: 13, fontWeight: 500, color: "#0f172a", borderBottom: `0.5px solid #f1f5f9` }}>{r.brand_name}</td>
                  <td style={{ padding: "10px 13px", fontSize: 13, color: C.gray, borderBottom: `0.5px solid #f1f5f9` }}>{planLabel}</td>
                  <td style={{ padding: "10px 13px", fontSize: 13, fontWeight: 500, color: C.teal, borderBottom: `0.5px solid #f1f5f9` }}>{r.commission_amount ? `$${r.commission_amount}/mo` : "—"}</td>
                  <td style={{ padding: "10px 13px", borderBottom: `0.5px solid #f1f5f9` }}>
                    <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 500, background: r.status === "Paid" ? C.greenLight : C.amberLight, color: r.status === "Paid" ? C.greenText : C.amberText }}>{r.status}</span>
                  </td>
                  <td style={{ padding: "10px 13px", fontSize: 12, color: C.gray, borderBottom: `0.5px solid #f1f5f9` }}>{payoutDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── Commission Calculator Modal ──────────────────────────────────────────────
const PLAN_RATES = {
  basic:      { label: "Basic",      monthlyFee: 29,  commissionPct: 10 },
  starter:    { label: "Starter",    monthlyFee: 49,  commissionPct: 12 },
  growth:     { label: "Growth",     monthlyFee: 79,  commissionPct: 14 },
  enterprise: { label: "Enterprise", monthlyFee: 129, commissionPct: 15 },
};

function CommissionCalculatorModal({ onClose }) {
  const [plan, setPlan] = useState("starter");
  const [monthlyRevenue, setMonthlyRevenue] = useState("");
  const [customRate, setCustomRate] = useState("");
  const [result, setResult] = useState(null);

  const planData = PLAN_RATES[plan] || PLAN_RATES.starter;
  const effectiveRate = customRate !== "" ? parseFloat(customRate) : planData.commissionPct;

  const calculate = () => {
    const rev = parseFloat(monthlyRevenue.replace(/[^0-9.]/g, ""));
    if (!rev || rev <= 0 || isNaN(effectiveRate)) {
      setResult(null);
      return;
    }
    const monthly = (rev * effectiveRate) / 100;
    const annual = monthly * 12;
    setResult({ monthly, annual, rate: effectiveRate, rev });
  };

  // Auto-calculate on any input change
  useEffect(() => { calculate(); }, [plan, monthlyRevenue, customRate]);

  const fmt = (n) => `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 440, boxShadow: "0 8px 40px rgba(0,0,0,0.18)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>💰</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Commission Calculator</span>
          </div>
          <span onClick={onClose} style={{ cursor: "pointer", fontSize: 20, color: C.gray, lineHeight: 1 }}>×</span>
        </div>

        {/* Plan selector */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 6 }}>Plan</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6 }}>
            {Object.entries(PLAN_RATES).map(([key, p]) => (
              <button
                key={key}
                onClick={() => { setPlan(key); setCustomRate(""); }}
                style={{
                  padding: "7px 4px",
                  fontSize: 12,
                  fontWeight: plan === key ? 600 : 400,
                  border: `1.5px solid ${plan === key ? C.teal : "#e2e8f0"}`,
                  borderRadius: 7,
                  background: plan === key ? C.tealLight : "#fff",
                  color: plan === key ? C.teal : "#0f172a",
                  cursor: "pointer",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Monthly Revenue */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 6 }}>Brand's Monthly Revenue (USD)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g. 50000"
            value={monthlyRevenue}
            onChange={(e) => setMonthlyRevenue(e.target.value)}
            style={{ width: "100%", padding: "9px 11px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 7, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Commission Rate */}
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 6 }}>
            Commission Rate (%) — <span style={{ color: C.teal }}>{planData.commissionPct}% default for {planData.label}</span>
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.5"
            placeholder={`${planData.commissionPct}`}
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            style={{ width: "100%", padding: "9px 11px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 7, outline: "none", boxSizing: "border-box" }}
          />
          <div style={{ fontSize: 11, color: C.gray, marginTop: 4 }}>Leave blank to use plan default ({planData.commissionPct}%)</div>
        </div>

        {/* Result */}
        {result ? (
          <div style={{ background: C.tealLight, border: `1px solid ${C.teal}30`, borderRadius: 9, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: C.teal, fontWeight: 500, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>Estimated Commission</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <div style={{ fontSize: 11, color: C.gray }}>Monthly</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.teal }}>{fmt(result.monthly)}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: C.gray }}>Annual</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: C.tealDark }}>{fmt(result.annual)}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: C.gray, borderTop: `1px solid ${C.teal}20`, paddingTop: 8 }}>
              {fmt(result.rev)} revenue × {result.rate}% rate = {fmt(result.monthly)}/mo
            </div>
          </div>
        ) : (
          <div style={{ background: "#f8fafc", border: `1px solid #e2e8f0`, borderRadius: 9, padding: "14px 16px", textAlign: "center", color: C.gray, fontSize: 12 }}>
            Enter a monthly revenue figure above to see your estimated commission.
          </div>
        )}

        <button
          onClick={onClose}
          style={{ marginTop: 16, width: "100%", padding: "9px", fontSize: 13, fontWeight: 500, background: C.teal, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

// ─── Resources Tab ────────────────────────────────────────────────────────────
function ResourcesTab() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);

  const typeIcon = (type) => {
    const map = { PDF: "📊", Video: "📹", DOC: "📋", ZIP: "🖼️", Sheet: "💰", doc: "📋", pdf: "📊", video: "📹", zip: "🖼️", sheet: "💰" };
    return map[type] || "📄";
  };

  // Returns true if this resource is the Commission Calculator
  const isCalculator = (r) =>
    (r.type || "").toLowerCase() === "sheet" ||
    (r.title || "").toLowerCase().includes("commission calculator");

  const handleOpen = (r) => {
    if (isCalculator(r)) { setShowCalculator(true); return; }
    if (!r.file_url || r.file_url.trim() === "") {
      alert("This resource will be uploaded soon.");
      return;
    }
    const type = (r.type || "").toLowerCase();
    if (type === "doc" || type === "zip") {
      const a = document.createElement("a");
      a.href = r.file_url;
      a.download = r.title || "file";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.open(r.file_url, "_blank");
    }
  };

  useEffect(() => {
    api.get("/resources")
      .then((res) => {
        const data = res.data;
        if (data.success) setResources(data.resources);
        else setFetchError("Failed to load resources.");
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setFetchError("Could not connect to server.");
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 20, overflowY: "auto", height: "100%", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {showCalculator && <CommissionCalculatorModal onClose={() => setShowCalculator(false)} />}
      {loading ? (
        <div style={{ color: C.gray, fontSize: 13 }}>Loading resources...</div>
      ) : fetchError ? (
        <div style={{ background: C.redLight, color: C.redText, fontSize: 13, padding: "10px 14px", borderRadius: 8 }}>{fetchError}</div>
      ) : resources.length === 0 ? (
        <div style={{ color: C.gray, fontSize: 13 }}>No resources available yet.</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {resources.map((r) => {
            const clickable = true; // all cards are clickable (missing URLs show alert)
            return (
              <div
                key={r.id}
                onClick={() => handleOpen(r)}
                style={{ border: `1px solid #e2e8f0`, borderRadius: 8, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, cursor: clickable ? "pointer" : "default", background: "#fff", transition: "border-color 0.15s" }}
                onMouseEnter={(e) => { if (clickable) e.currentTarget.style.borderColor = C.teal; }}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.tealLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{typeIcon(r.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: C.gray }}>{r.description}</div>
                </div>
                <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 6, background: C.grayLight, color: C.gray }}>{r.type}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
function EditProfileModal({ partner, onClose, onSaved }) {
  const [form, setForm] = useState({
    full_name: partner?.full_name || "",
    agency_name: partner?.agency_name || "",
    phone: partner?.phone || "",
    website: partner?.website || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.full_name || !form.agency_name) {
      setError("Full name and agency name are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await api.post(`/profile/${partner.id}`, form);
      const data = res.data;
      if (data.success) {
        onSaved(data.partner);
        onClose();
      } else {
        setError(data.message || "Failed to save.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 22, width: 400, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Edit Profile</span>
          <span onClick={onClose} style={{ cursor: "pointer", fontSize: 18, color: C.gray }}>×</span>
        </div>
        {[["Full name", "full_name", "text"], ["Agency name", "agency_name", "text"], ["Phone", "phone", "text"], ["Website", "website", "text"]].map(([label, key, type]) => (
          <div key={key} style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 4 }}>{label}</label>
            <input type={type} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 7, outline: "none", boxSizing: "border-box" }} />
          </div>
        ))}
        {error && <div style={{ background: C.redLight, color: C.redText, fontSize: 12, padding: "7px 10px", borderRadius: 6, marginBottom: 10 }}>{error}</div>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "7px 14px", border: `1px solid #cbd5e1`, background: "#fff", borderRadius: 7, cursor: "pointer", fontSize: 13 }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ padding: "7px 16px", background: saving ? C.gray : C.teal, color: "#fff", border: "none", borderRadius: 7, cursor: saving ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500 }}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────
function ChangePasswordModal({ partnerId, onClose }) {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleChange = async () => {
    setError("");
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setStatus("saving");
    try {
      const res = await api.post("/profile/change-password", {
        partner_id: partnerId,
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      const data = res.data;
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("idle");
        setError(data.message || "Failed to change password.");
      }
    } catch (err) {
      setStatus("idle");
      setError("Could not connect to server.");
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 22, width: 380, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Change Password</span>
          <span onClick={onClose} style={{ cursor: "pointer", fontSize: 18, color: C.gray }}>×</span>
        </div>
        {status === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.green }}>Password changed successfully!</div>
            <button onClick={onClose} style={{ marginTop: 16, padding: "7px 18px", background: C.teal, color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13 }}>Close</button>
          </div>
        ) : (
          <>
            {[["Current password", "oldPassword"], ["New password", "newPassword"], ["Confirm new password", "confirmPassword"]].map(([label, key]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 4 }}>{label}</label>
                <input type="password" value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: `1px solid #cbd5e1`, borderRadius: 7, outline: "none", boxSizing: "border-box" }} />
              </div>
            ))}
            {error && <div style={{ background: C.redLight, color: C.redText, fontSize: 12, padding: "7px 10px", borderRadius: 6, marginBottom: 10 }}>{error}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button onClick={onClose} style={{ padding: "7px 14px", border: `1px solid #cbd5e1`, background: "#fff", borderRadius: 7, cursor: "pointer", fontSize: 13 }}>Cancel</button>
              <button onClick={handleChange} disabled={status === "saving"} style={{ padding: "7px 16px", background: status === "saving" ? C.gray : C.teal, color: "#fff", border: "none", borderRadius: 7, cursor: status === "saving" ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500 }}>
                {status === "saving" ? "Saving..." : "Change password"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ partner, onPartnerUpdate }) {
  const [profileData, setProfileData] = useState({ partner: partner || null });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(null);
  const [whatsappAlerts, setWhatsappAlerts] = useState(null);
  const [togglingEmail, setTogglingEmail] = useState(false);
  const [togglingWhatsapp, setTogglingWhatsapp] = useState(false);

  useEffect(() => {
    api.get("/dashboard")
      .then((r) => setProfileData(r.data))
      .catch(console.error);
  }, []);

  const currentPartner = profileData.partner || partner;

  // Load notification preferences once we have the partner id
  useEffect(() => {
    const pid = currentPartner?.id;
    if (!pid) return;
    api.get(`/profile/${pid}/notifications`)
      .then((r) => {
        const data = r.data;
        if (data.success) {
          setEmailNotifications(data.email_notifications);
          setWhatsappAlerts(data.whatsapp_alerts);
        }
      })
      .catch(console.error);
  }, [currentPartner?.id]);

  const handleCopyReferral = () => {
    const link = `mobidrag.com/ref/${currentPartner?.agency_name?.toLowerCase().replace(/\s+/g, "") || ""}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleProfileSaved = (updatedPartner) => {
    setProfileData((prev) => ({ ...prev, partner: updatedPartner }));
    if (onPartnerUpdate) onPartnerUpdate(updatedPartner);
  };

  const toggleEmailNotifications = async () => {
    if (togglingEmail || !currentPartner?.id) return;
    const next = !emailNotifications;
    setTogglingEmail(true);
    try {
      const res = await api.patch(`/profile/${currentPartner.id}/notifications`, {
        email_notifications: next,
      });
      const data = res.data;
      if (data.success) setEmailNotifications(data.email_notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingEmail(false);
    }
  };

  const toggleWhatsappAlerts = async () => {
    if (togglingWhatsapp || !currentPartner?.id) return;
    const next = !whatsappAlerts;
    setTogglingWhatsapp(true);
    try {
      const res = await api.patch(`/profile/${currentPartner.id}/notifications`, {
        whatsapp_alerts: next,
      });
      const data = res.data;
      if (data.success) setWhatsappAlerts(data.whatsapp_alerts);
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingWhatsapp(false);
    }
  };

  return (
    <div style={{ padding: 20, overflowY: "auto", height: "100%", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      {showEditModal && (
        <EditProfileModal
          partner={currentPartner}
          onClose={() => setShowEditModal(false)}
          onSaved={handleProfileSaved}
        />
      )}
      {showPasswordModal && (
        <ChangePasswordModal
          partnerId={currentPartner?.id}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: "#0f172a" }}>Agency profile</div>
          <Card style={{ padding: "14px 16px", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 14 }}>
              <Avatar name={currentPartner?.full_name || "R"} bg={C.green} size={46} />
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{currentPartner?.full_name || "Loading..."}</div>
                <div style={{ fontSize: 12, color: C.gray }}>{currentPartner?.agency_name || ""}</div>
              </div>
              <button onClick={() => setShowEditModal(true)} style={{ marginLeft: "auto", fontSize: 11, padding: "3px 10px", border: `1px solid #cbd5e1`, background: "#fff", borderRadius: 6, cursor: "pointer" }}>Edit</button>
            </div>
            <div style={{ height: "0.5px", background: "#e2e8f0", marginBottom: 12 }} />
            <InfoRow label="Email" value={currentPartner?.email || "—"} />
            <InfoRow label="Phone" value={currentPartner?.phone || "—"} />
            <InfoRow label="Website" value={currentPartner?.website || "—"} accent />
            <InfoRow label="Partner since" value="January 2025" />
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: `0.5px solid ${C.grayLight}` }}>
              <span style={{ fontSize: 12, color: C.gray, minWidth: 120, flexShrink: 0 }}>Referral link</span>
              <span
                style={{ fontSize: 13, color: C.teal, wordBreak: "break-all", cursor: "pointer", flex: 1 }}
                onClick={handleCopyReferral}
                title="Click to copy"
              >
                mobidrag.com/ref/{currentPartner?.agency_name?.toLowerCase().replace(/\s+/g, "") || "loading"}
              </span>
              <button
                onClick={handleCopyReferral}
                style={{ fontSize: 11, padding: "2px 8px", border: `1px solid #cbd5e1`, background: copied ? C.greenLight : "#fff", color: copied ? C.greenText : C.gray, borderRadius: 5, cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {copied ? "Copied!" : "📋 Copy"}
              </button>
            </div>
          </Card>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: "#0f172a" }}>Account settings</div>
          <Card>
            {/* Password row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: `0.5px solid #f1f5f9` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>Password</div>
                <div style={{ fontSize: 11, color: C.gray }}>Last changed 3 months ago</div>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                style={{ fontSize: 11, padding: "4px 12px", borderRadius: 6, border: `1px solid #cbd5e1`, background: "#fff", color: "#0f172a", cursor: "pointer", fontWeight: 400 }}
              >
                Change
              </button>
            </div>

            {/* Email notifications row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: `0.5px solid #f1f5f9` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>Email notifications</div>
                <div style={{ fontSize: 11, color: C.gray }}>
                  {emailNotifications === null ? "Loading..." : emailNotifications ? "Enabled — deal updates, payouts, news" : "Disabled"}
                </div>
              </div>
              <button
                onClick={toggleEmailNotifications}
                disabled={togglingEmail || emailNotifications === null}
                style={{
                  fontSize: 11, padding: "4px 12px", borderRadius: 6,
                  border: `1px solid ${emailNotifications ? C.teal : "#cbd5e1"}`,
                  background: emailNotifications ? C.tealLight : "#fff",
                  color: emailNotifications ? C.teal : "#0f172a",
                  cursor: togglingEmail || emailNotifications === null ? "not-allowed" : "pointer",
                  fontWeight: 400, opacity: togglingEmail ? 0.6 : 1,
                }}
              >
                {togglingEmail ? "..." : emailNotifications ? "On" : "Off"}
              </button>
            </div>

            {/* WhatsApp alerts row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>WhatsApp alerts</div>
                <div style={{ fontSize: 11, color: C.gray }}>
                  {whatsappAlerts === null ? "Loading..." : whatsappAlerts ? "Enabled for deal status changes" : "Disabled"}
                </div>
              </div>
              <button
                onClick={toggleWhatsappAlerts}
                disabled={togglingWhatsapp || whatsappAlerts === null}
                style={{
                  fontSize: 11, padding: "4px 12px", borderRadius: 6,
                  border: `1px solid ${whatsappAlerts ? C.teal : "#cbd5e1"}`,
                  background: whatsappAlerts ? C.tealLight : "#fff",
                  color: whatsappAlerts ? C.teal : "#0f172a",
                  cursor: togglingWhatsapp || whatsappAlerts === null ? "not-allowed" : "pointer",
                  fontWeight: 400, opacity: togglingWhatsapp ? 0.6 : 1,
                }}
              >
                {togglingWhatsapp ? "..." : whatsappAlerts ? "On" : "Off"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Main Portal ──────────────────────────────────────────────────────────────
function Portal({ onSignOut, partner: initialPartner }) {
  const [tab, setTab] = useState("home");
  const [viewDeal, setViewDeal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [partner, setPartner] = useState(initialPartner);
  const [showAgreement, setShowAgreement] = useState(true);
  // ── Notifications ──
  const [notifications, setNotifications] = useState([]);
  const [bellOpen, setBellOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = React.useRef(null);

// Notifications
useEffect(() => {
  api.get("/notifications")
    .then((r) => {
      const data = r.data;
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.length);
      }
    })
    .catch(console.error);
}, []);

// Agreement Check
useEffect(() => {
  if (!partner?.id) return;

  const checkAgreement = async () => {
    try {
      const response = await api.get(`/partner/agreement/${partner.id}`);

      if (!response.data.agreement_accepted) {
        setShowAgreement(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  checkAgreement();
}, [partner]);
  // Close dropdown on outside click
  useEffect(() => {
    if (!bellOpen) return;
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [bellOpen]);

  const handleBellClick = () => {
    setBellOpen((v) => !v);
    if (!bellOpen) setUnreadCount(0); // mark as read when opened
  };

  const fmtTime = (ts) => {
    if (!ts) return "";
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  const titles = { home: "Dashboard", deals: "My Deals", "deal-view": "Deal Detail", reg: "Register a Deal", comm: "Commissions", res: "Resources", train: "Training", profile: "Profile" };

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "system-ui, sans-serif" }}>
      <Sidebar active={tab} setTab={(t) => setTab(t)} onSignOut={onSignOut} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#f8fafc" }}>
        {/* Topbar */}
        <div style={{ background: "#fff", borderBottom: `0.5px solid #e2e8f0`, padding: "13px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {tab === "deal-view" && (
              <button onClick={() => setTab("deals")} style={{ padding: "5px 10px", fontSize: 12, border: `1px solid #cbd5e1`, background: "#fff", borderRadius: 6, cursor: "pointer" }}>← Back to deals</button>
            )}
            <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{titles[tab]}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Bell with dropdown */}
            <div ref={bellRef} style={{ position: "relative" }}>
              <button
                onClick={handleBellClick}
                style={{ padding: "6px 10px", border: `1px solid #cbd5e1`, background: "#fff", borderRadius: 6, cursor: "pointer", fontSize: 14, position: "relative" }}
              >
                🔔
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    background: C.red, color: "#fff",
                    fontSize: 9, fontWeight: 700,
                    width: 15, height: 15, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    lineHeight: 1,
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {bellOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  width: 300, background: "#fff",
                  border: `0.5px solid #e2e8f0`, borderRadius: 10,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                  zIndex: 100, overflow: "hidden",
                }}>
                  <div style={{ padding: "10px 14px", borderBottom: `0.5px solid #f1f5f9`, fontSize: 12, fontWeight: 600, color: "#0f172a" }}>
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "16px 14px", fontSize: 12, color: C.gray, textAlign: "center" }}>
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((n, i) => (
                      <div key={n.id || i} style={{
                        padding: "10px 14px",
                        borderBottom: i < notifications.length - 1 ? `0.5px solid #f1f5f9` : "none",
                        display: "flex", flexDirection: "column", gap: 2,
                      }}>
                        <span style={{ fontSize: 12, color: "#0f172a", lineHeight: 1.4 }}>{n.text}</span>
                        <span style={{ fontSize: 10, color: C.gray }}>{fmtTime(n.created_at)}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <Avatar name={partner?.full_name?.[0] || "P"} bg={C.green} size={30} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a" }}>{partner?.full_name || "Partner"}</div>
              <div style={{ fontSize: 11, color: C.gray }}>{partner?.agency_name || ""}</div>
            </div>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {tab === "home" && <Dashboard key={refreshKey} setTab={setTab} setViewDeal={setViewDeal} />}
          {tab === "deals" && <DealsTab key={refreshKey} setTab={setTab} setViewDeal={setViewDeal} />}
          {tab === "deal-view" && <DealDetail dealKey={viewDeal} onStageChange={triggerRefresh} />}
          {tab === "reg" && <RegisterDeal />}
          {tab === "comm" && <CommissionsTab />}
          {tab === "res" && <ResourcesTab />}
          {tab === "train" && <div style={{ padding: 20, color: C.gray, fontSize: 13 }}>Training content coming soon...</div>}
          {tab === "profile" && <ProfileTab partner={partner} onPartnerUpdate={(p) => setPartner(p)} />}
        </div>
      </div>
      {showAgreement && (
  <AgreementModal
    partner={partner}
    onAgree={() => setShowAgreement(false)}
  />
)}
    </div>
  );
}

// ─── Application Form Screen ──────────────────────────────────────────────────
function ApplicationForm({ onBack }) {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", linkedin: "",
    agency_name: "", website: "", years_exp: "1–2 years", shopify_clients: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.agency_name) {
      setErrorMsg("Full name, email, and agency name are required.");
      return;
    }
    setErrorMsg("");
    setStatus("submitting");
    try {
      const res = await api.post('/apply', form);
      const data = res.data;
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("idle");
        setErrorMsg(data.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      setStatus("idle");
      setErrorMsg("Could not connect to server. Please try again.");
    }
  };

  const f = (key, ph, type = "text") => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 4 }}>{ph}</label>
      <input
        type={type}
        placeholder={ph}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #cbd5e1", borderRadius: 7, outline: "none", boxSizing: "border-box" }}
      />
    </div>
  );

  if (status === "success") {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center", maxWidth: 380, padding: 32 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Application submitted!</div>
          <div style={{ fontSize: 13, color: C.gray, marginBottom: 24, lineHeight: 1.6 }}>
            Thanks for applying to the MobiDrag Partner Program.<br />
            Our team will review your application and get back to you within 2 business days.
          </div>
          <button
            onClick={onBack}
            style={{ padding: "9px 22px", background: C.teal, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 500, fontSize: 13 }}
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", background: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "24px 20px" }}>
        {/* Header */}
        <div style={{ background: C.dark, borderRadius: 10, padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, background: C.teal, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>M</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>MobiDrag Partner Application</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Apply to become a sales partner</div>
          </div>
          <button
            onClick={onBack}
            style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.45)", background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 5, padding: "4px 10px", cursor: "pointer" }}
          >
            ← Back to login
          </button>
        </div>

        {/* Personal info */}
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", marginBottom: 14, paddingBottom: 8, borderBottom: "0.5px solid #f1f5f9" }}>Personal information</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {f("full_name", "Full name")}
            {f("email", "Email address", "email")}
            {f("phone", "Phone / WhatsApp")}
            {f("linkedin", "LinkedIn profile")}
          </div>
        </div>

        {/* Agency details */}
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", marginBottom: 14, paddingBottom: 8, borderBottom: "0.5px solid #f1f5f9" }}>Agency / company details</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {f("agency_name", "Agency name")}
            {f("website", "Website")}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 4 }}>Years in ecommerce</label>
              <select
                value={form.years_exp}
                onChange={(e) => setForm({ ...form, years_exp: e.target.value })}
                style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #cbd5e1", borderRadius: 7, outline: "none", background: "#fff" }}
              >
                {["Less than 1 year", "1–2 years", "3–5 years", "5+ years"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            {f("shopify_clients", "Active Shopify clients (approx.)")}
          </div>
        </div>

        {/* Pitch */}
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a", marginBottom: 14, paddingBottom: 8, borderBottom: "0.5px solid #f1f5f9" }}>Why do you want to partner?</div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.gray, display: "block", marginBottom: 4 }}>Tell us about your business and how you'd sell MobiDrag</label>
            <textarea
              rows={4}
              placeholder="Describe your experience with Shopify, your client base, and how you plan to promote MobiDrag to brands..."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #cbd5e1", borderRadius: 7, outline: "none", resize: "vertical", boxSizing: "border-box" }}
            />
          </div>
          <div style={{ fontSize: 11, color: C.gray }}>Applications are reviewed within 2 business days. You'll receive a confirmation email after submission.</div>
        </div>

        {/* Error */}
        {errorMsg && (
          <div style={{ background: C.redLight, color: C.redText, fontSize: 12, padding: "8px 12px", borderRadius: 7, marginBottom: 12 }}>{errorMsg}</div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onBack} style={{ padding: "8px 14px", border: "1px solid #cbd5e1", background: "#fff", borderRadius: 7, cursor: "pointer", fontSize: 13, color: C.gray }}>Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={status === "submitting"}
            style={{ padding: "8px 20px", background: status === "submitting" ? C.gray : C.teal, color: "#fff", border: "none", borderRadius: 7, cursor: status === "submitting" ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 500 }}
          >
            {status === "submitting" ? "Submitting..." : "Submit application →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [partner, setPartner] = useState(null);

  const handleLogin = (partnerData) => {
    setPartner(partnerData);

    if (partnerData?.role === "admin") {
      setScreen("admin");
    } else {
      setScreen("portal");
    }
  };

  const handleSignOut = () => {
    setPartner(null);
    localStorage.removeItem("userRole");
    setScreen("login");
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {screen === "login" && (
        <LoginScreen
          onLogin={handleLogin}
         onApply={() => setScreen("apply")}
          
          onForgot={() => {}}
        />
      )}

      {screen === "portal" && (
        <Portal
          partner={partner}
          onSignOut={handleSignOut}
        />
      )}

{screen === "apply" && (
    <ApplicationForm
        onBack={() => setScreen("login")}
    />
)}

      {screen === "admin" && (
        <AdminApp
          partner={partner}
          onSignOut={handleSignOut}
        />
      )}
    </div>
  );
}