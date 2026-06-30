const PRESETS = {
  active:     { bg: "#d1fae5", color: "#065f46" },
  inactive:   { bg: "#f1f5f9", color: "#475569" },
  suspended:  { bg: "#fee2e2", color: "#991b1b" },
  pending:    { bg: "#fef3c7", color: "#92400e" },
  approved:   { bg: "#d1fae5", color: "#065f46" },
  rejected:   { bg: "#fee2e2", color: "#991b1b" },
  won:        { bg: "#d1fae5", color: "#065f46" },
  lost:       { bg: "#fee2e2", color: "#991b1b" },
  platinum:   { bg: "#ede9fe", color: "#5b21b6" },
  gold:       { bg: "#fef3c7", color: "#92400e" },
  silver:     { bg: "#f1f5f9", color: "#475569" },
  stalled:    { bg: "#fee2e2", color: "#991b1b" },
  required:   { bg: "#dbeafe", color: "#1e40af" },
  optional:   { bg: "#f1f5f9", color: "#475569" },
};

export default function StatusBadge({ status, label }) {
  const key = (status || "").toLowerCase();
  const style = PRESETS[key] || { bg: "#f1f5f9", color: "#475569" };
  return (
    <span style={{
      background: style.bg,
      color: style.color,
      fontSize: 11,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 10,
      display: "inline-flex",
      alignItems: "center",
      whiteSpace: "nowrap",
    }}>
      {label || status}
    </span>
  );
}