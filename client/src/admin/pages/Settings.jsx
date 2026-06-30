import { useState } from "react";
import PageTitle from "../components/PageTitle";

function SectionCard({ title, children }) {
  return (
    <div style={{ background: "#fff", border: "0.5px solid #e2e8f0", borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", borderBottom: "0.5px solid #f1f5f9" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{title}</span>
      </div>
      <div style={{ padding: "18px 20px" }}>{children}</div>
    </div>
  );
}

function FieldRow({ label, hint, children }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 24, padding: "12px 0", borderBottom: "0.5px solid #f8fafc" }}>
      <div style={{ minWidth: 200 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{label}</div>
        {hint && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: value ? "#0d9f8f" : "#cbd5e1",
        border: "none", cursor: "pointer", position: "relative",
        transition: "background 0.2s", padding: 0,
      }}
    >
      <div style={{
        width: 16, height: 16, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 3,
        left: value ? 21 : 3,
        transition: "left 0.2s",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </button>
  );
}

export default function Settings() {
  const [tiers, setTiers] = useState({ silver: 10, gold: 12, platinum: 15 });
  const [program, setProgram] = useState({ payoutDay: 15, minPayout: 100, cookieDays: 90, autoApprove: false });
  const [notifs, setNotifs] = useState({ newDeal: true, newApplication: true, stalled: true, payoutReminder: true });
  const [admins, setAdmins] = useState([
    { id: 1, name: "Nigam Shah", email: "admin@login.com", role: "admin" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputStyle = {
    padding: "7px 10px", fontSize: 13, border: "1px solid #e2e8f0",
    borderRadius: 7, outline: "none", width: 120, boxSizing: "border-box",
  };

  return (
    <div>
      <PageTitle title="Program Settings" subtitle="Configure commissions, defaults, and notifications" />

      {/* Commission Tiers */}
      <SectionCard title="Commission Tiers">
        {["silver", "gold", "platinum"].map((tier) => (
          <FieldRow
            key={tier}
            label={`${tier.charAt(0).toUpperCase() + tier.slice(1)} tier`}
            hint="Applied to all new deals for partners at this tier"
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                min={0} max={50}
                value={tiers[tier]}
                onChange={(e) => setTiers((t) => ({ ...t, [tier]: Number(e.target.value) }))}
                style={inputStyle}
              />
              <span style={{ fontSize: 13, color: "#64748b" }}>% commission</span>
            </div>
          </FieldRow>
        ))}
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={save} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 500, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>
            {saved ? "Saved ✓" : "Save Tiers"}
          </button>
        </div>
      </SectionCard>

      {/* Program Defaults */}
      <SectionCard title="Program Defaults">
        <FieldRow label="Payout day" hint="Day of month payouts are processed (1–28)">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number" min={1} max={28}
              value={program.payoutDay}
              onChange={(e) => setProgram((p) => ({ ...p, payoutDay: Number(e.target.value) }))}
              style={inputStyle}
            />
            <span style={{ fontSize: 13, color: "#64748b" }}>of each month</span>
          </div>
        </FieldRow>
        <FieldRow label="Minimum payout" hint="Balances below this roll to the next cycle">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number" min={0}
              value={program.minPayout}
              onChange={(e) => setProgram((p) => ({ ...p, minPayout: Number(e.target.value) }))}
              style={inputStyle}
            />
            <span style={{ fontSize: 13, color: "#64748b" }}>USD</span>
          </div>
        </FieldRow>
        <FieldRow label="Referral cookie duration" hint="Days a referral link click stays attributed">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="number" min={1}
              value={program.cookieDays}
              onChange={(e) => setProgram((p) => ({ ...p, cookieDays: Number(e.target.value) }))}
              style={inputStyle}
            />
            <span style={{ fontSize: 13, color: "#64748b" }}>days</span>
          </div>
        </FieldRow>
        <FieldRow label="Auto-approve applications" hint="Auto-approve applicants meeting basic criteria">
          <Toggle value={program.autoApprove} onChange={(v) => setProgram((p) => ({ ...p, autoApprove: v }))} />
        </FieldRow>
        <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
          <button onClick={save} style={{ padding: "7px 18px", fontSize: 12, fontWeight: 500, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}>
            {saved ? "Saved ✓" : "Save Defaults"}
          </button>
        </div>
      </SectionCard>

      {/* Notification Settings */}
      <SectionCard title="Notification Settings">
        {[
          { key: "newDeal", label: "New deal registered", hint: "Alert when a partner submits a new deal" },
          { key: "newApplication", label: "New partner application", hint: "Alert when someone applies to the program" },
          { key: "stalled", label: "Deal stalled 7+ days", hint: "Alert when a deal has no stage update for 7 days" },
          { key: "payoutReminder", label: "Payout reminders", hint: "Reminder 3 days before the payout cycle date" },
        ].map((n) => (
          <FieldRow key={n.key} label={n.label} hint={n.hint}>
            <Toggle value={notifs[n.key]} onChange={(v) => setNotifs((ns) => ({ ...ns, [n.key]: v }))} />
          </FieldRow>
        ))}
      </SectionCard>

      {/* Admin Management */}
      <SectionCard title="Admin Team">
        <div style={{ marginBottom: 16 }}>
          {admins.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "0.5px solid #f1f5f9" }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#0d9f8f", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
              }}>{a.name[0]}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0f172a" }}>{a.name}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{a.email}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, background: "#ede9fe", color: "#5b21b6", padding: "2px 8px", borderRadius: 8 }}>Admin</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="team@mobidrag.com"
            style={{ flex: 1, padding: "7px 10px", fontSize: 13, border: "1px solid #e2e8f0", borderRadius: 7, outline: "none" }}
          />
          <button
            onClick={() => {
              if (inviteEmail) {
                setAdmins((as) => [...as, { id: Date.now(), name: inviteEmail.split("@")[0], email: inviteEmail, role: "admin" }]);
                setInviteEmail("");
              }
            }}
            style={{ padding: "7px 16px", fontSize: 12, fontWeight: 500, background: "#0d9f8f", color: "#fff", border: "none", borderRadius: 7, cursor: "pointer" }}
          >Invite Team Member</button>
        </div>
      </SectionCard>
    </div>
  );
}