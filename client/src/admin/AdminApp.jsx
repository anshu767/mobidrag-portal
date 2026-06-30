import { useState } from "react";
import AdminLayout from "./layout/AdminLayout";

export default function AdminApp({ partner, onSignOut }) {
  return <AdminLayout partner={partner} onSignOut={onSignOut} />;
}