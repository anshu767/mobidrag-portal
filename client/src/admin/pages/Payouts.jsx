import { useState, useEffect } from "react";
import api from "../../api/axios";
import PageTitle from "../components/PageTitle";
import MetricCard from "../components/MetricCard";
import StatusBadge from "../components/StatusBadge";

export default function Payouts() {
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [paidIds, setPaidIds] = useState([]);
  const [confirmAll, setConfirmAll] = useState(false);
  const [totalPaidYear, setTotalPaidYear] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setLoading(true);
      const [pendingRes, historyRes] = await Promise.all([
        api.get("/admin/payouts"),
        api.get("/admin/payouts/history"),
      ]);

      if (pendingRes.data.success) {
        setPending(pendingRes.data.pending || []);
      }

      if (historyRes.data.success) {
        const hist = historyRes.data.history || [];
        setHistory(hist);
        const yearTotal = hist.reduce((s, h) => s + (Number(h.amount) || 0), 0);
        setTotalPaidYear(yearTotal);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (partner) => {
    if (paidIds.includes(partner.id)) return;
    try {
      await api.post("/admin/payouts/mark-paid", {
        partner_id: partner.id,
        amount: partner.amount,
        month_label: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      });
      setPaidIds((p) => [...p, partner.id]);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllPaid = async () => {
    try {
      const unpaid = pending.filter((p) => !paidIds.includes(p.id));
      await api.post("/admin/payouts/mark-all-paid", {
        partners: unpaid.map((p) => ({
          partner_id: p.id,
          amount: p.amount,
          month_label: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
        })),
      });
      setPaidIds(pending.map((p) => p.id));
      setConfirmAll(false);
    } catch (err) {
      console.error(err);
    }
  };

  const totalPending = pending.reduce((s, p) => s + p.amount, 0);
  const totalPaid = paidIds.reduce((s, id) => {
    const p = pending.find((x) => x.id === id);
    return s + (p?.amount || 0);
  }, 0);

  const avgRate = pending.length > 0
    ? (pending.reduce((s, p) => s + parseFloat(p.rate) || 0, 0) / pending.length).toFixed(1) + "%"
    : "—";

  return (
    <div>
      <PageTitle title="Payouts" subtitle="Manage and track monthly commission payouts" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        <MetricCard label="Due This Cycle" value={`₹${totalPending.toLocaleString()}`} sub={`${pending.length} partners`} icon="📅" accent="#f59e0b" />
        <MetricCard label="Paid This Month" value={`₹${totalPaid.toLocaleString()}`} sub="marked paid so far" icon="✅" accent="#10b981" />
        <MetricCard label="Total Paid (Year)" value={`₹${totalPaidYear.toLocaleString()}`} sub="from payout history" icon="📊" accent="#3b82f6" />
        <MetricCard label="Avg Commission Rate" value={avgRate} sub="across pending partners" icon="%" accent="#8b5cf6" />
      </div>

      {/* Pending */}
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
            Pending Payouts — {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <button
            onClick={() => setConfirmAll(true)}
            style={{ padding: "6px 14px", fontSize: 12, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer", fontWeight: 500 }}
          >Mark All as Paid</button>
        </div>
        <div>
          {loading && (
            <div style={{ padding: "20px 18px", fontSize: 13, color: "#94a3b8" }}>Loading...</div>
          )}
          {!loading && pending.length === 0 && (
            <div style={{ padding: "20px 18px", fontSize: 13, color: "#94a3b8" }}>No pending payouts.</div>
          )}
          {pending.map((p, i) => {
            const isPaid = paidIds.includes(p.id);
            return (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px",
                borderBottom: i < pending.length - 1 ? "0.5px solid #f1f5f9" : "none",
                opacity: isPaid ? 0.5 : 1,
                background: isPaid ? "#f8fafc" : "#fff",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: isPaid ? "#94a3b8" : "#0d9f8f",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{p.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    {p.apps} apps · {p.rate} commission · {Array.isArray(p.brands) ? p.brands.join(", ") : p.brands}
                  </div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>₹{p.amount.toLocaleString()}</div>
                <button
                  onClick={() => !isPaid && markPaid(p)}
                  disabled={isPaid}
                  style={{
                    padding: "6px 14px", fontSize: 12, fontWeight: 500,
                    background: isPaid ? "#d1fae5" : "#f1f5f9",
                    color: isPaid ? "#065f46" : "#475569",
                    border: "1px solid " + (isPaid ? "#d1fae5" : "#e2e8f0"),
                    borderRadius: 7, cursor: isPaid ? "default" : "pointer",
                  }}
                >{isPaid ? "Paid ✓" : "Mark Paid"}</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "0.5px solid #f1f5f9" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Payout History</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "0.5px solid #e2e8f0" }}>
              {["Partner", "Month", "Amount", "Status", "Payment Reference"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.length === 0 && !loading && (
              <tr>
                <td colSpan={5} style={{ padding: "20px 16px", fontSize: 13, color: "#94a3b8" }}>No payout history yet.</td>
              </tr>
            )}
            {history.map((h, i) => (
              <tr key={h.id} style={{ borderBottom: i < history.length - 1 ? "0.5px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "11px 16px", fontSize: 13, color: "#0f172a" }}>{h.partner}</td>
                <td style={{ padding: "11px 16px", fontSize: 12, color: "#64748b" }}>{h.month}</td>
                <td style={{ padding: "11px 16px", fontSize: 13, fontWeight: 500, color: "#0f172a" }}>₹{Number(h.amount).toLocaleString()}</td>
                <td style={{ padding: "11px 16px" }}><StatusBadge status="approved" label="Paid" /></td>
                <td style={{ padding: "11px 16px", fontSize: 11, color: "#94a3b8", fontFamily: "monospace" }}>{h.ref}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirm all modal */}
      {confirmAll && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 380, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>Confirm Bulk Payout</div>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>
              This will mark <strong>all {pending.filter((p) => !paidIds.includes(p.id)).length} partners</strong> as paid for a total of <strong>₹{totalPending.toLocaleString()}</strong>. This action cannot be undone and will trigger payout emails to all partners.
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setConfirmAll(false)} style={{ padding: "7px 16px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 7, cursor: "pointer" }}>Cancel</button>
              <button onClick={markAllPaid} style={{ padding: "7px 16px", fontSize: 12, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Confirm & Pay All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}