export default function StatCard({ label, value, color, children }) {
  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid #e2e8f0",
      borderRadius: 10,
      padding: "14px 16px",
      borderTop: `3px solid ${color || "#0d9f8f"}`,
    }}>
      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      {value !== undefined && (
        <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>{value}</div>
      )}
      {children}
    </div>
  );
}