import { useEffect, useState } from "react";
import api from "../../api/axios";

import MetricCard from "../components/MetricCard";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";

const PIPELINE_FALLBACK = [
  { stage: "Contacted", count: 0, mrr: 0, color: "#94a3b8" },
  { stage: "Demo Scheduled", count: 0, mrr: 0, color: "#f59e0b" },
  { stage: "Demo Done", count: 0, mrr: 0, color: "#3b82f6" },
  { stage: "Negotiating", count: 0, mrr: 0, color: "#8b5cf6" },
  { stage: "Won", count: 0, mrr: 0, color: "#10b981" },
];

export default function Dashboard({ setPage }) {
  const [stats, setStats] = useState({
    totalPartners: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
    activeDeals: 0,
    pendingApplications: 0,
  });
  const [topPartners, setTopPartners] = useState([]);
  const [pipeline, setPipeline] = useState(PIPELINE_FALLBACK);
  const [attention, setAttention] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.get("/admin/dashboard");

      if (res.data.success) {
        setStats(res.data.stats);
        if (Array.isArray(res.data.topPartners)) {
          setTopPartners(res.data.topPartners);
        }
        if (Array.isArray(res.data.pipeline)) {
          setPipeline(res.data.pipeline);
        }
        if (Array.isArray(res.data.attention)) {
          setAttention(res.data.attention);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const maxRevenue = topPartners.length > 0 ? topPartners[0].revenue : 1;

  const PARTNER_COLORS = ["#0d9f8f", "#8b5cf6", "#3b82f6", "#f59e0b"];

  const METRICS = [
    {
      label: "Total Partners",
      value: stats.totalPartners,
      sub: "Registered Partners",
      trend: null,
      icon: "👥",
      accent: "#0d9f8f",
    },
    {
      label: "Partner Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      sub: "Won Deals",
      trend: null,
      icon: "💵",
      accent: "#10b981",
    },
    {
      label: "Pending Payouts",
      value: `₹${stats.pendingPayouts.toLocaleString()}`,
      sub: "Awaiting Payment",
      trend: null,
      icon: "💰",
      accent: "#f59e0b",
    },
    {
      label: "Active Deals",
      value: stats.activeDeals,
      sub: "Current Pipeline",
      trend: null,
      icon: "🤝",
      accent: "#3b82f6",
    },
  ];

  return (
    <div>
      {/* Metrics */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {METRICS.map((m) => <MetricCard key={m.label} {...m} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        {/* Needs Your Attention */}
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Needs Your Attention</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>{attention.length} item{attention.length !== 1 ? "s" : ""}</span>
          </div>
          {attention.length === 0 && (
            <div style={{ padding: "20px 18px", fontSize: 13, color: "#94a3b8" }}>All caught up!</div>
          )}
          {attention.map((item) => (
            <div
              key={item.type}
              onClick={() => setPage(item.page)}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "12px 18px", borderBottom: "0.5px solid #f8fafc",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: item.color + "18",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, flexShrink: 0,
              }}>{item.icon}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{item.text}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{item.sub}</div>
              </div>
              <span style={{ marginLeft: "auto", fontSize: 13, color: "#cbd5e1" }}>›</span>
            </div>
          ))}
        </div>

        {/* Top Partners */}
        <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Top Partners</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>by revenue this month</span>
          </div>
          <div style={{ padding: "6px 0" }}>
            {topPartners.length === 0 && (
              <div style={{ padding: "20px 18px", fontSize: 13, color: "#94a3b8" }}>No partner data yet.</div>
            )}
            {topPartners.map((p, i) => (
              <div key={p.name} style={{ padding: "10px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%",
                      background: PARTNER_COLORS[i % PARTNER_COLORS.length],
                      color: "#fff", fontSize: 12, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{p.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#0f172a" }}>{p.name}</div>
                      <StatusBadge status={p.tier.toLowerCase()} label={p.tier} />
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>₹{p.revenue.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>Comm: ₹{p.commission.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ height: 4, background: "#f1f5f9", borderRadius: 2 }}>
                  <div style={{
                    height: "100%",
                    width: `${(p.revenue / maxRevenue) * 100}%`,
                    background: PARTNER_COLORS[i % PARTNER_COLORS.length],
                    borderRadius: 2,
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #f1f5f9" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Pipeline Overview</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0 }}>
          {pipeline.map((s, i) => (
            <div
              key={s.stage}
              style={{
                padding: "16px 18px",
                borderRight: i < pipeline.length - 1 ? "0.5px solid #f1f5f9" : "none",
                borderTop: `3px solid ${s.color}`,
                background: s.stage === "Won" ? "#f0fdf4" : "#fff",
              }}
            >
              <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6 }}>{s.stage}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>{s.count}</div>
              <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>₹{(s.mrr / 1000).toFixed(1)}K MRR</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}