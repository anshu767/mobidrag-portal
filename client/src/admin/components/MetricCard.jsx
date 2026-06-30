export default function MetricCard({ label, value, sub, trend, trendUp, icon, accent }) {
  const accentColor = accent || "#0d9f8f";
  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid #e2e8f0",
      borderRadius: 10,
      padding: "18px 20px",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</span>
        {icon && (
          <span style={{
            width: 32, height: 32,
            background: accentColor + "18",
            borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15,
          }}>{icon}</span>
        )}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginTop: 2 }}>{value}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
        {trend !== undefined && (
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: trendUp ? "#10b981" : "#ef4444",
            background: trendUp ? "#d1fae5" : "#fee2e2",
            padding: "1px 6px", borderRadius: 6,
          }}>
            {trendUp ? "▲" : "▼"} {trend}
          </span>
        )}
        {sub && <span style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</span>}
      </div>
    </div>
  );
}