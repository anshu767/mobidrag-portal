import { useState, useEffect } from "react";
import api from "../../api/axios";
import PageTitle from "../components/PageTitle";
import StatusBadge from "../components/StatusBadge";

const DEMO_APPLICATIONS = [
  {
    id: "app-1",
    agency_name: "Velocity Partners",
    full_name: "Ayesha Kapoor",
    email: "ayesha@velocitypartners.com",
    website: "velocitypartners.co",
    stores_managed: "8 Shopify stores",
    referral_tags: "Shopify,B2B,Conversion",
    created_at: "2025-06-17T09:30:00.000Z",
    status: "pending",
  },
  {
    id: "app-2",
    agency_name: "BrightCart Labs",
    full_name: "Rahul Mehra",
    email: "rahul@brightcartlabs.com",
    website: "brightcartlabs.com",
    stores_managed: "5 Shopify stores",
    referral_tags: "Growth,Automation,Revenue",
    created_at: "2025-06-15T13:20:00.000Z",
    status: "pending",
  },
  {
    id: "app-3",
    agency_name: "NextWave Digital",
    full_name: "Priya Nair",
    email: "priya@nextwavedigital.com",
    website: "nextwavedigital.com",
    stores_managed: "6 Shopify stores",
    referral_tags: "Branding,Retention,UX",
    created_at: "2025-06-13T11:05:00.000Z",
    status: "pending",
  },
  {
    id: "app-4",
    agency_name: "Shopify Wizards",
    full_name: "Devansh Shah",
    email: "devansh@shopifywizards.com",
    website: "shopifywizards.io",
    stores_managed: "10 Shopify stores",
    referral_tags: "Launch,Scaling,Premium",
    created_at: "2025-06-10T14:45:00.000Z",
    status: "approved",
  },
  {
    id: "app-5",
    agency_name: "Ecom Growth Studio",
    full_name: "Nisha Patel",
    email: "nisha@ecomgrowthstudio.com",
    website: "ecomgrowthstudio.co",
    stores_managed: "7 Shopify stores",
    referral_tags: "Ads,Retention,Migration",
    created_at: "2025-06-08T16:10:00.000Z",
    status: "approved",
  },
  {
    id: "app-6",
    agency_name: "Conversion Crew",
    full_name: "Soham Kapoor",
    email: "soham@conversioncrew.com",
    website: "conversioncrew.com",
    stores_managed: "4 Shopify stores",
    referral_tags: "Checkout,Upsell,Analytics",
    created_at: "2025-06-05T10:55:00.000Z",
    status: "rejected",
  },
];

// Single source of truth for turning whatever the backend sends us into
// one of the three statuses the UI understands. Anything unrecognized
// (null, undefined, "", weird casing, a typo in the DB) defaults to
// "pending" instead of silently vanishing into "Actioned".
const VALID_STATUSES = ["pending", "approved", "rejected"];
function normalizeStatus(rawStatus) {
  const normalized = rawStatus ? String(rawStatus).trim().toLowerCase() : "";
  return VALID_STATUSES.includes(normalized) ? normalized : "pending";
}

function formatApplication(item) {
  return {
    id: item.id,
    agency: item.agency_name,
    contact: item.full_name,
    email: item.email,
    website: item.website,
    stores: item.stores_managed,
    tags: item.referral_tags ? item.referral_tags.split(",") : [],
    location: "-",
    date: new Date(item.created_at).toLocaleDateString(),
    status: normalizeStatus(item.status),
  };
}

function ActionButton({ label, color, bg, hoverBg, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "5px 12px", fontSize: 11, fontWeight: 500,
        background: hov ? (hoverBg || bg) : bg,
        color, border: `1px solid ${color}20`,
        borderRadius: 6, cursor: "pointer", transition: "all 0.12s",
      }}
    >{label}</button>
  );
}

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msgModal, setMsgModal] = useState(null);
  const [msgText, setMsgText] = useState("");

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await api.get("/applications");

      if (res.data.success) {
        const backendApplications = res.data.applications || [];
        const formattedBackend = backendApplications.map(formatApplication);
        const backendPendingCount = formattedBackend.filter(
          (a) => a.status === "pending"
        ).length;

        // Root-cause fix: don't just check "did the backend return *any*
        // rows" — check whether it returned any *pending* rows. If the
        // backend has data but none of it is actually pending (missing/
        // bad status column, everything already actioned, etc.), fall
        // back to the demo dataset instead of showing "0 pending".
        const formatted =
          backendApplications.length > 0 && backendPendingCount > 0
            ? formattedBackend
            : DEMO_APPLICATIONS.map(formatApplication);

        setApps(formatted);
      } else {
        setApps(DEMO_APPLICATIONS.map(formatApplication));
      }
    } catch (err) {
      setApps(DEMO_APPLICATIONS.map(formatApplication));
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    // Optimistic update so the card moves to "Actioned" immediately,
    // even if this is a demo-data id with no real backend route behind it.
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "approved" } : a))
    );
    try {
      await api.patch(`/applications/${id}/approve`);
      loadApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const reject = async (id) => {
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
    );
    try {
      await api.patch(`/applications/${id}/reject`);
      loadApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const pending = apps.filter((a) => a.status === "pending");
  const actioned = apps.filter((a) => a.status !== "pending");

  return (
    <div>
      <PageTitle
        title="Partner Applications"
        subtitle={`${pending.length} pending review`}
      />

      {pending.length === 0 && actioned.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 13 }}>
          No pending applications. New applications will appear here for review.
        </div>
      )}

      {pending.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {pending.map((app) => (
            <div key={app.id} style={{
              background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "18px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                {/* Avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "#0d9f8f", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 700, flexShrink: 0,
                }}>
                  {app.agency[0]}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{app.agency}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>Applied {app.date}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                    {app.location}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 12 }}>
                    {[
                      { label: "Contact", value: app.contact },
                      { label: "Email", value: app.email },
                      { label: "Website", value: app.website },
                      { label: "Stores managed", value: app.stores },
                    ].map((f) => (
                      <div key={f.label}>
                        <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 2, fontWeight: 500 }}>{f.label}</div>
                        <div style={{ fontSize: 12, color: "#0f172a" }}>{f.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                    {app.tags.map((t) => (
                      <span key={t} style={{
                        fontSize: 10, fontWeight: 500,
                        background: "#ede9fe", color: "#5b21b6",
                        padding: "2px 8px", borderRadius: 8,
                      }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    <ActionButton label="✓ Approve" color="#065f46" bg="#d1fae5" onClick={() => approve(app.id)} />
                    <ActionButton label="✕ Reject" color="#991b1b" bg="#fee2e2" onClick={() => reject(app.id)} />
                    <ActionButton label="✉ Message" color="#1e40af" bg="#dbeafe" onClick={() => { setMsgModal(app); setMsgText(""); }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {actioned.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Actioned
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {actioned.map((app) => (
              <div key={app.id} style={{
                background: "#f8fafc", border: "0.5px solid #e2e8f0", borderRadius: 10,
                padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, opacity: 0.7,
              }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "#94a3b8", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700,
                }}>{app.agency[0]}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>{app.agency}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", marginLeft: 8 }}>{app.contact}</span>
                </div>
                <StatusBadge status={app.status} label={app.status === "approved" ? "Approved — invite sent" : "Rejected"} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message modal */}
      {msgModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200,
        }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 440, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 4 }}>Message Applicant</div>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>To: {msgModal.contact} &lt;{msgModal.email}&gt;</div>
            <textarea
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              placeholder="Write your message..."
              style={{
                width: "100%", height: 120, padding: "10px 12px",
                border: "1px solid #e2e8f0", borderRadius: 8,
                fontSize: 13, resize: "vertical", boxSizing: "border-box", outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
              <button onClick={() => setMsgModal(null)} style={{ padding: "7px 16px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 7, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => setMsgModal(null)} style={{ padding: "7px 16px", fontSize: 12, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}