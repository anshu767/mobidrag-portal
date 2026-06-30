import { useState } from "react";
import PageTitle from "../components/PageTitle";

const CATEGORY_COLORS = {
  "Sales Decks": { bg: "#ede9fe", color: "#5b21b6" },
  "PDFs": { bg: "#dbeafe", color: "#1e40af" },
  "Videos": { bg: "#fef3c7", color: "#92400e" },
  "Templates": { bg: "#d1fae5", color: "#065f46" },
};

const INITIAL_RESOURCES = [
  { id: 1, name: "MobiDrag Sales Deck 2025", category: "Sales Decks", description: "Latest pitch deck with product highlights and pricing.", size: "4.2 MB", type: "pptx", visible: true, uploaded: "Jun 10, 2025" },
  { id: 2, name: "Partner Onboarding Guide", category: "PDFs", description: "Step-by-step guide for new partner onboarding.", size: "1.8 MB", type: "pdf", visible: true, uploaded: "May 28, 2025" },
  { id: 3, name: "Product Demo Walkthrough", category: "Videos", description: "Screen recording of full product demo for clients.", size: "82 MB", type: "mp4", visible: true, uploaded: "May 15, 2025" },
  { id: 4, name: "Commission Calculator", category: "Templates", description: "Excel template for calculating monthly commissions.", size: "340 KB", type: "xlsx", visible: true, uploaded: "Apr 22, 2025" },
  { id: 5, name: "Email Templates Pack", category: "Templates", description: "Ready-to-use email templates for partner outreach.", size: "1.1 MB", type: "zip", visible: false, uploaded: "Apr 10, 2025" },
  { id: 6, name: "Competitor Comparison Sheet", category: "PDFs", description: "Positioning doc comparing MobiDrag vs competitors.", size: "2.4 MB", type: "pdf", visible: true, uploaded: "Mar 30, 2025" },
];

const TYPE_ICONS = { pptx: "📊", pdf: "📄", mp4: "🎬", xlsx: "📈", zip: "🗜️", docx: "📝" };

function UploadModal({ onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cat, setCat] = useState("Sales Decks");
  const [dragging, setDragging] = useState(false);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 460, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 20 }}>Upload Resource</div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); }}
          style={{
            border: `2px dashed ${dragging ? "#0d9f8f" : "#e2e8f0"}`,
            borderRadius: 10, padding: "28px 20px",
            textAlign: "center", marginBottom: 16,
            background: dragging ? "#f0fdf4" : "#f8fafc",
            transition: "all 0.15s",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>📁</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>Drag & drop a file here, or</div>
          <button style={{ marginTop: 8, padding: "6px 14px", fontSize: 12, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Browse</button>
          <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 8 }}>PDF, PPTX, DOCX, XLSX, MP4, ZIP — max 100MB</div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Resource Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sales Deck Q3 2025" style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Description</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description for partners" style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Category</label>
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none" }}>
            {["Sales Decks", "PDFs", "Videos", "Templates"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "7px 16px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 7, cursor: "pointer" }}>Cancel</button>
          <button onClick={onClose} style={{ padding: "7px 16px", fontSize: 12, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Upload Resource</button>
        </div>
      </div>
    </div>
  );
}

export default function Resources() {
  const [resources, setResources] = useState(INITIAL_RESOURCES);
  const [showUpload, setShowUpload] = useState(false);

  const toggleVisibility = (id) => setResources((rs) => rs.map((r) => r.id === id ? { ...r, visible: !r.visible } : r));
  const deleteResource = (id) => setResources((rs) => rs.filter((r) => r.id !== id));

  return (
    <div>
      <PageTitle
        title="Resources"
        subtitle="Manage files visible to all partners"
        action={
          <button
            onClick={() => setShowUpload(true)}
            style={{ padding: "7px 16px", fontSize: 12, fontWeight: 500, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}
          >⬆ Upload Resource</button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {resources.map((r) => {
          const cat = CATEGORY_COLORS[r.category] || { bg: "#f1f5f9", color: "#475569" };
          return (
            <div key={r.id} style={{
              background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10,
              padding: 18, opacity: r.visible ? 1 : 0.6,
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 26 }}>{TYPE_ICONS[r.type] || "📄"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>{r.name}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, background: cat.bg, color: cat.color, padding: "1px 7px", borderRadius: 8 }}>{r.category}</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>{r.description}</div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>
                {r.size} · Uploaded {r.uploaded}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => toggleVisibility(r.id)}
                  style={{
                    flex: 1, padding: "5px 0", fontSize: 11, fontWeight: 500,
                    background: r.visible ? "#f0fdf4" : "#f1f5f9",
                    color: r.visible ? "#065f46" : "#475569",
                    border: `1px solid ${r.visible ? "#d1fae5" : "#e2e8f0"}`,
                    borderRadius: 6, cursor: "pointer",
                  }}
                >{r.visible ? "👁 Visible" : "🙈 Hidden"}</button>
                <button
                  onClick={() => deleteResource(r.id)}
                  style={{
                    padding: "5px 10px", fontSize: 11,
                    background: "#fee2e2", color: "#991b1b",
                    border: "1px solid #fee2e2", borderRadius: 6, cursor: "pointer",
                  }}
                >Delete</button>
              </div>
            </div>
          );
        })}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
    </div>
  );
}