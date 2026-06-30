export default function PageTitle({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#0f172a" }}>{title}</h2>
        {subtitle && <p style={{ margin: "3px 0 0", fontSize: 12, color: "#64748b" }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}