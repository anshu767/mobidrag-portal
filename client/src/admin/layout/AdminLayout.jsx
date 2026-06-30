import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import Dashboard from "../pages/Dashboard";
import Applications from "../pages/Applications";
import Partners from "../pages/Partners";
import Deals from "../pages/Deals";
import Payouts from "../pages/Payouts";
import Resources from "../pages/Resources";
import Training from "../pages/Training";
import Settings from "../pages/Settings";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  applications: "Partner Applications",
  partners: "All Partners",
  deals: "All Deals",
  payouts: "Payouts",
  resources: "Resources",
  training: "Training",
  settings: "Program Settings",
};

export default function AdminLayout({ partner, onSignOut }) {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    switch (page) {
      case "dashboard":    return <Dashboard setPage={setPage} />;
      case "applications": return <Applications />;
      case "partners":     return <Partners />;
      case "deals":        return <Deals />;
      case "payouts":      return <Payouts />;
      case "resources":    return <Resources />;
      case "training":     return <Training />;
      case "settings":     return <Settings />;
      default:             return <Dashboard setPage={setPage} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <AdminSidebar active={page} setPage={setPage} partner={partner} onSignOut={onSignOut} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", background: "#f8fafc" }}>
        <AdminHeader title={PAGE_TITLES[page]} partner={partner} />
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}