import { useState } from "react";
import api from "../api/axios";
export default function AgreementModal({ partner, onAgree }) {
  const [checked, setChecked] = useState(false);
  const [signature, setSignature] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 650,
          maxHeight: "85vh",
          overflowY: "auto",
          background: "#fff",
          borderRadius: 12,
          padding: 25,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h2 style={{ marginBottom: 15 }}>
          MobiDrag Partner Agreement
        </h2>

        <p style={{ color: "#555", lineHeight: 1.7 }}>
          Please read the following agreement carefully before referring clients.
        </p>

        <hr />

        <ol style={{ lineHeight: 1.8, color: "#444", paddingLeft: 20 }}>
          <li>I confirm that all information provided by me is accurate.</li>

          <li>
            I understand that commissions are paid only after a referred client
            successfully purchases an eligible MobiDrag plan.
          </li>

          <li>
            I will not submit fake, duplicate or fraudulent client referrals.
          </li>

          <li>
            I agree to represent MobiDrag professionally and ethically.
          </li>

          <li>
            MobiDrag reserves the right to approve or reject referrals that
            violate program policies.
          </li>

          <li>
            Commission rates and payout schedules may change according to
            company policy.
          </li>

          <li>
            I agree that my acceptance and digital signature may be stored for
            compliance purposes.
          </li>
        </ol>

        <div style={{ marginTop: 20 }}>
          <label style={{ fontWeight: 600 }}>
            Digital Signature
          </label>

          <input
            type="text"
            placeholder="Type your full name"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            style={{
              width: "100%",
              marginTop: 8,
              padding: 10,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginTop: 18 }}>
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />{" "}
            I have read, understood and agree to the MobiDrag Partner Agreement.
          </label>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 25,
          }}
        >
          <button
  onClick={() => onAgree()}
  style={{
    padding: "10px 18px",
    border: "1px solid #ccc",
    background: "#fff",
    borderRadius: 8,
    cursor: "pointer",
  }}
>
  Cancel
</button>
          <button
  disabled={!checked || !signature}
  onClick={async () => {
    console.log("Partner:", partner);
    try {
      const response = await api.post("/partner/agreement", {
        partner_id: partner?.id,
        signature: signature,
      });

      if (response.data.success) {
        onAgree(signature);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save agreement.");
    }
  }}
  style={{
    padding: "10px 18px",
    background: !checked || !signature ? "#94a3b8" : "#14b8a6",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: !checked || !signature ? "not-allowed" : "pointer",
  }}
>
  Agree & Continue
  
</button>
        </div>
      </div>
    </div>
  );
}