import { useEffect, useState } from "react";
import api from "../api/axios";

const C = {
  teal: "#0d9f8f",
  gray: "#64748b",
  grayLight: "#f1f5f9",
};

function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", border: `0.5px solid #e2e8f0`, borderRadius: 10, overflow: "hidden", ...style }}>
      {children}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/dashboard");
        setStats([
          { label: "Active Partners", value: response.data.activePartners },
          { label: "Pending Approvals", value: response.data.pendingApprovals },
          { label: "Monthly Leads", value: response.data.monthlyLeads },
        ]);
      } catch (err) {
        console.error(err);
        setError("Unable to load dashboard metrics.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: "#0f172a" }}>Dashboard</h1>
          <p style={{ margin: "8px 0 0", color: C.gray }}>Overview of program health and activity.</p>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 20, padding: 14, borderRadius: 10, background: "#fee2e2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        {loading
          ? [1, 2, 3].map((index) => (
              <Card key={index} style={{ minHeight: 120, padding: 20 }}>
                <div style={{ height: 18, width: "60%", background: C.grayLight, borderRadius: 6, marginBottom: 10 }} />
                <div style={{ height: 28, width: "40%", background: C.grayLight, borderRadius: 6 }} />
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.label} style={{ padding: 20 }}>
                <p style={{ margin: 0, fontSize: 12, color: C.gray, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {stat.label}
                </p>
                <p style={{ margin: "12px 0 0", fontSize: 32, fontWeight: 700, color: C.teal }}>
                  {stat.value ?? "—"}
                </p>
              </Card>
            ))}
      </div>
    </section>
  );
}

export default Dashboard;