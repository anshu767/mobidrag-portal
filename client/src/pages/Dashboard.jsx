import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useEffect } from "react";
import axios from "axios";
import AgreementModal from "../components/AgreementModal";
const [showAgreement, setShowAgreement] = useState(false);
useEffect(() => {
  const checkAgreement = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/partner/agreement/${partner.id}`
      );

      if (!res.data.agreement_accepted) {
        setShowAgreement(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (partner?.id) {
    checkAgreement();
  }
}, [partner]);
function Dashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/dashboard');

      setStats([
        {
          label: 'Active Partners',
          value: response.data.activePartners
        },
        {
          label: 'Pending Approvals',
          value: response.data.pendingApprovals
        },
        {
          label: 'Monthly Leads',
          value: response.data.monthlyLeads
        }
      ]);
    } catch (error) {
      console.log(error);
    }
  };
  {showAgreement && (
  <AgreementModal
    partner={partner}
    onAgree={() => setShowAgreement(false)}
/>
)}

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Dashboard
      </h1>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            className="rounded-2xl bg-white p-6 shadow-sm"
            key={stat.label}
          >
            <p className="text-sm font-medium text-slate-500">
              {stat.label}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;