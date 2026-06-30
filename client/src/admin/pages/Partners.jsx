import { useState, useEffect } from "react";
import api from "../../api/axios";
import PageTitle from "../components/PageTitle";
import StatusBadge from "../components/StatusBadge";


const TABS = ["All", "Platinum", "Gold", "Silver", "Inactive"];

export default function Partners() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [managePartner, setManagePartner] = useState(null);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tierDraft, setTierDraft] = useState("");

  useEffect(() => {
    loadPartners();

    // Refresh the list whenever a new partner is added from AdminHeader
    const handlePartnerAdded = () => loadPartners();
    window.addEventListener("partnerAdded", handlePartnerAdded);

    return () => {
      window.removeEventListener("partnerAdded", handlePartnerAdded);
    };
  }, []);

const loadPartners = async () => {
  try {
    const res = await api.get("/admin/partners");

    if (res.data.success) {

      const formatted = res.data.partners.map((p) => ({
        id: p.id,
        name: p.agency_name || "-",
        contact: p.full_name || "-",
        email: p.email || "-",
        location: "-",
        tier: p.tier || "Silver",
        appsSold: 0,
        revenue: 0,
        commission: p.commission_rate || 0,
        status: p.status || "Active",
      }));

      setPartners(formatted);

    }

  } catch (err) {

    console.log(err);

  } finally {

    setLoading(false);

  }
};
  const filtered = partners.filter((p) => {
    const matchTab =
      activeTab === "All" ||
      activeTab === "Inactive" ? ["Inactive", "Suspended"].includes(p.status) || (activeTab !== "Inactive" && p.tier === activeTab)
        : p.tier === activeTab;
    // simplify:
    const tabMatch =
      activeTab === "All" ? true :
      activeTab === "Inactive" ? (p.status === "Inactive" || p.status === "Suspended") :
      p.tier === activeTab;
    const searchMatch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contact.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    return tabMatch && searchMatch;
  });

  const openManage = (p) => {
    setManagePartner(p);
    setTierDraft(p.tier);
  };

 const applyTier = async () => {

  try {

    await api.patch(
      `/admin/partners/${managePartner.id}/tier`,
      {
        tier: tierDraft,
      }
    );

    setManagePartner(null);

    loadPartners();

  } catch (err) {

    console.log(err);

  }

};

 const toggleStatus = async () => {

  try {

    const next =
      managePartner.status === "Active"
        ? "Suspended"
        : "Active";

    await api.patch(
      `/admin/partners/${managePartner.id}/status`,
      {
        status: next,
      }
    );

    setManagePartner(null);

    loadPartners();

  } catch (err) {

    console.log(err);

  }

};

  return (
    <div>
      <PageTitle title="All Partners" subtitle={`${partners.length} partners in the program`} />

      {/* Filter tabs + search */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 2, background: "#f1f5f9", borderRadius: 8, padding: 3 }}>
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              style={{
                padding: "5px 14px", fontSize: 12, fontWeight: 500, border: "none",
                borderRadius: 6, cursor: "pointer", transition: "all 0.12s",
                background: activeTab === t ? "#fff" : "transparent",
                color: activeTab === t ? "#0f172a" : "#64748b",
                boxShadow: activeTab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >{t}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partners..."
            style={{
              padding: "7px 12px", fontSize: 12, border: "1px solid #e2e8f0",
              borderRadius: 7, outline: "none", width: 200,
            }}
          />
          <button style={{
            padding: "7px 14px", fontSize: 12, background: "#f1f5f9",
            border: "1px solid #e2e8f0", borderRadius: 7, cursor: "pointer", color: "#475569",
          }}>⬇ Export CSV</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "0.5px solid #e2e8f0" }}>
              {["Partner", "Tier", "Apps Sold", "Revenue", "Commission", "Status", ""].map((h) => (
                <th key={h} style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#64748b", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? "0.5px solid #f1f5f9" : "none" }}>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: "#0d9f8f", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 700, flexShrink: 0,
                    }}>{p.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{p.location}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "12px 16px" }}><StatusBadge status={p.tier.toLowerCase()} label={p.tier} /></td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#0f172a" }}>{p.appsSold}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#0f172a", fontWeight: 500 }}>${p.revenue.toLocaleString()}</td>
                <td style={{ padding: "12px 16px", fontSize: 13, color: "#0f172a" }}>${p.commission.toLocaleString()}</td>
                <td style={{ padding: "12px 16px" }}><StatusBadge status={p.status.toLowerCase()} label={p.status} /></td>
                <td style={{ padding: "12px 16px" }}>
                  <button
                    onClick={() => openManage(p)}
                    style={{
                      padding: "5px 12px", fontSize: 11, fontWeight: 500,
                      background: "#f1f5f9", border: "1px solid #e2e8f0",
                      borderRadius: 6, cursor: "pointer", color: "#475569",
                    }}
                  >Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8", fontSize: 13 }}>
            No partners match this filter.
          </div>
        )}
      </div>

      {/* Manage Modal */}
      {managePartner && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 420, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#0d9f8f", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 700,
              }}>{managePartner.name[0]}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{managePartner.name}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>{managePartner.contact} · {managePartner.email}</div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Tier Override</div>
              <div style={{ display: "flex", gap: 8 }}>
                <select
                  value={tierDraft}
                  onChange={(e) => setTierDraft(e.target.value)}
                  style={{ flex: 1, padding: "7px 10px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none" }}
                >
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                </select>
                <button onClick={applyTier} style={{ padding: "7px 16px", fontSize: 12, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Update</button>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", marginBottom: 8 }}>Account Status</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "#f8fafc", borderRadius: 8 }}>
                <span style={{ fontSize: 13, color: "#0f172a" }}>
                  Currently: <StatusBadge status={managePartner.status.toLowerCase()} label={managePartner.status} />
                </span>
                <button
                  onClick={toggleStatus}
                  style={{
                    padding: "6px 14px", fontSize: 12, border: "none", borderRadius: 6, cursor: "pointer",
                    background: managePartner.status === "Active" ? "#fee2e2" : "#d1fae5",
                    color: managePartner.status === "Active" ? "#991b1b" : "#065f46",
                    fontWeight: 500,
                  }}
                >
                  {managePartner.status === "Active" ? "Suspend Account" : "Activate Account"}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setManagePartner(null)} style={{ padding: "7px 18px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 7, cursor: "pointer" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}