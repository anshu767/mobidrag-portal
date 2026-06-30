import { useState } from "react";
import PageTitle from "../components/PageTitle";
import StatusBadge from "../components/StatusBadge";

const INITIAL_MODULES = [
  { id: 1, name: "MobiDrag Product Overview", lessons: 5, completed: 18, total: 22, required: true, description: "Introduction to MobiDrag features, use cases, and core value proposition." },
  { id: 2, name: "Partner Onboarding Essentials", lessons: 4, completed: 20, total: 22, required: true, description: "How to register deals, use the portal, and communicate with clients." },
  { id: 3, name: "Sales Playbook & Objection Handling", lessons: 7, completed: 14, total: 22, required: true, description: "Sales frameworks, common objections, and strategies to close Shopify brands." },
  { id: 4, name: "Demo Mastery", lessons: 6, completed: 11, total: 22, required: false, description: "How to deliver a compelling MobiDrag demo for different store types." },
  { id: 5, name: "Advanced Commission Strategies", lessons: 3, completed: 8, total: 22, required: false, description: "Tips to maximize commission earnings through tier upgrades and upsells." },
];

function CreateModuleModal({ onClose }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [required, setRequired] = useState(true);
  const [lessons, setLessons] = useState([{ title: "", url: "" }]);

  const addLesson = () => setLessons((ls) => [...ls, { title: "", url: "" }]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, width: 500, maxHeight: "85vh", overflow: "auto", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 20 }}>Create Training Module</div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Module Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Advanced Sales Techniques" style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b", display: "block", marginBottom: 5 }}>Description</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="What will partners learn?" style={{ width: "100%", padding: "7px 10px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none", resize: "vertical", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
          <label style={{ fontSize: 12, fontWeight: 500, color: "#64748b" }}>Required for partners:</label>
          <button onClick={() => setRequired(!required)} style={{
            padding: "4px 12px", fontSize: 11, fontWeight: 600,
            background: required ? "#dbeafe" : "#f1f5f9",
            color: required ? "#1e40af" : "#64748b",
            border: "none", borderRadius: 20, cursor: "pointer",
          }}>{required ? "Yes — Required" : "No — Optional"}</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#64748b", marginBottom: 8 }}>Lessons</div>
          {lessons.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                placeholder={`Lesson ${i + 1} title`}
                style={{ flex: 1, padding: "7px 10px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none" }}
              />
              <input
                placeholder="Video/content URL"
                style={{ flex: 1, padding: "7px 10px", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none" }}
              />
            </div>
          ))}
          <button onClick={addLesson} style={{ fontSize: 12, color: "#0d9f8f", background: "none", border: "none", cursor: "pointer", padding: 0 }}>+ Add lesson</button>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "7px 16px", fontSize: 12, background: "#f1f5f9", border: "none", borderRadius: 7, cursor: "pointer" }}>Cancel</button>
          <button onClick={onClose} style={{ padding: "7px 16px", fontSize: 12, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>Create Module</button>
        </div>
      </div>
    </div>
  );
}

export default function Training() {
  const [modules, setModules] = useState(INITIAL_MODULES);
  const [showCreate, setShowCreate] = useState(false);

  const toggleRequired = (id) => setModules((ms) => ms.map((m) => m.id === id ? { ...m, required: !m.required } : m));

  return (
    <div>
      <PageTitle
        title="Training"
        subtitle="Manage training modules and track partner completion"
        action={
          <button onClick={() => setShowCreate(true)} style={{ padding: "7px 16px", fontSize: 12, fontWeight: 500, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>
            + Create Module
          </button>
        }
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {modules.map((m) => {
          const pct = Math.round((m.completed / m.total) * 100);
          return (
            <div key={m.id} style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{m.name}</span>
                    <StatusBadge status={m.required ? "required" : "optional"} label={m.required ? "Required" : "Optional"} />
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>{m.description}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>{m.lessons} lessons</span>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: "#f1f5f9", borderRadius: 3 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#10b981" : "#0d9f8f", borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 11, color: "#64748b", whiteSpace: "nowrap" }}>
                        {m.completed}/{m.total} partners ({pct}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  <button onClick={() => toggleRequired(m.id)} style={{
                    padding: "5px 12px", fontSize: 11, fontWeight: 500,
                    background: "#f1f5f9", border: "1px solid #e2e8f0",
                    borderRadius: 6, cursor: "pointer", color: "#475569",
                  }}>
                    {m.required ? "Make Optional" : "Make Required"}
                  </button>
                  <button style={{
                    padding: "5px 12px", fontSize: 11, fontWeight: 500,
                    background: "#f1f5f9", border: "1px solid #e2e8f0",
                    borderRadius: 6, cursor: "pointer", color: "#475569",
                  }}>Edit</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && <CreateModuleModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}