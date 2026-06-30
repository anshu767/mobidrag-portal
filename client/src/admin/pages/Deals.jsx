import { useState, useEffect } from "react";
import api from "../../api/axios";
import PageTitle from "../components/PageTitle";
import StatusBadge from "../components/StatusBadge";



const TABS = ["All", "Needs Action", "Won", "Lost"];

const STAGE_COLORS = {
  "Contacted": { bg: "#f1f5f9", color: "#475569" },
  "Demo Scheduled": { bg: "#fef3c7", color: "#92400e" },
  "Demo Done": { bg: "#dbeafe", color: "#1e40af" },
  "Negotiating": { bg: "#ede9fe", color: "#5b21b6" },
  "Won": { bg: "#d1fae5", color: "#065f46" },
  "Lost": { bg: "#fee2e2", color: "#991b1b" },
};

function StageBadge({ stage, stalled, stalledDays }) {
  const s = STAGE_COLORS[stage] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>{stage}</span>
      {stalled && (
        <span style={{ background: "#fee2e2", color: "#991b1b", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 8 }}>
          Stalled {stalledDays}d
        </span>
      )}
    </span>
  );
}

export default function Deals() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [detailDeal, setDetailDeal] = useState(null);
  const [deals, setDeals] = useState([]);
  const [adminNote, setAdminNote] = useState("");
  useEffect(() => {
  loadDeals();
}, []);

const loadDeals = async () => {

  try {

    const res = await api.get("/admin/deals");

    if (res.data.success) {

      const formatted = res.data.deals.map((d) => ({

        id: d.id,

        brand: d.brand_name,

        url: d.shopify_store_url,

        partner: d.partner_name,

        plan: d.plan,

        price: Number(d.commission_amount),

        stage: d.stage,

        stalled: false,

        stalledDays: 0,

        updated: new Date(d.created_at).toLocaleDateString(),

      }));

      setDeals(formatted);

    }

  } catch (err) {

    console.log(err);

  }

};

  const filtered = deals.filter((d) => {
    const tabMatch =
      activeTab === "All" ? true :
      activeTab === "Won" ? d.stage === "Won" :
      activeTab === "Lost" ? d.stage === "Lost" :
      activeTab === "Needs Action" ? (d.stalled || (d.stage !== "Won" && d.stage !== "Lost")) : true;
    const searchMatch = !search || d.brand.toLowerCase().includes(search.toLowerCase()) || d.partner.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

const updateStage = async (id, stage) => {

  try {

    await api.patch(
      `/admin/deals/${id}/stage`,
      {
        stage,
      }
    );

    loadDeals();

    if (detailDeal) {

      setDetailDeal({
        ...detailDeal,
        stage,
      });

    }

  } catch (err) {

    console.log(err);

  }

};

  return (
    <div>
      <PageTitle title="All Deals" subtitle="Cross-partner deal pipeline" />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 2, background: "#f1f5f9", borderRadius: 8, padding: 3 }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "5px 14px", fontSize: 12, fontWeight: 500, border: "none", borderRadius: 6, cursor: "pointer",
              background: activeTab === t ? "#fff" : "transparent",
              color: activeTab === t ? "#0f172a" : "#64748b",
              boxShadow: activeTab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>{t}</button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search brand or partner..."
          style={{ padding: "7px 12px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none", width: 220 }}
        />
      </div>

      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "0.5px solid #e2e8f0" }}>
              {["Brand", "Partner", "Plan", "Stage", "Last Updated", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textAlign: "left" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d, i) => (
              <tr key={d.id} style={{ borderBottom: i < filtered.length - 1 ? "0.5px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{d.brand}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{d.url}</div>
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#475569" }}>{d.partner}</td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ fontSize: 12, color: "#0f172a" }}>{d.plan}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>${d.price}/mo</div>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <StageBadge stage={d.stage} stalled={d.stalled} stalledDays={d.stalledDays} />
                </td>
                <td style={{ padding: "12px 16px", fontSize: 12, color: "#64748b" }}>{d.updated}</td>
                <td style={{ padding: "12px 16px" }}>
                  <button onClick={() => setDetailDeal(d)} style={{
                    padding: "5px 12px", fontSize: 11, background: "#f1f5f9",
                    border: "1px solid #e2e8f0", borderRadius: 6, cursor: "pointer", color: "#475569",
                  }}>Open</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 13 }}>No deals match this filter.</div>
        )}
      </div>

      {/* Deal Detail Modal */}
      {detailDeal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 480, maxHeight: "80vh", overflow: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "0.5px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#0f172a" }}>{detailDeal.brand}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{detailDeal.url}</div>
              </div>
              <button onClick={() => setDetailDeal(null)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#94a3b8" }}>✕</button>
            </div>
            <div style={{ padding: "18px 24px" }}>
              {[
                { label: "Partner", value: detailDeal.partner },
                { label: "Plan", value: `${detailDeal.plan} — $${detailDeal.price}/mo` },
                { label: "Last updated", value: detailDeal.updated },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "0.5px solid #f1f5f9" }}>
                  <span style={{ fontSize: 12, color: "#64748b", minWidth: 110 }}>{r.label}</span>
                  <span style={{ fontSize: 12, color: "#0f172a" }}>{r.value}</span>
                </div>
              ))}

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Update Stage</div>
                <select
                  value={detailDeal.stage}
                  onChange={(e) => updateStage(detailDeal.id, e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none" }}
                >
                  {["Contacted", "Demo Scheduled", "Demo Done", "Negotiating", "Won", "Lost"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Admin Note</div>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add an internal note (not visible to partner)..."
                  style={{ width: "100%", height: 80, padding: "8px 10px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none", resize: "vertical", boxSizing: "border-box" }}
                />
                <button style={{ marginTop: 6, padding: "6px 14px", fontSize: 12, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}