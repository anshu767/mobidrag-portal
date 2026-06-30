import { useEffect, useState } from 'react';
import api from '../api/axios';

function Home() {
  const [status, setStatus] = useState('Checking backend...');

  useEffect(() => {
    api
      .get('/health')
      .then((response) => setStatus(response.data.message))
      .catch(() => setStatus('Backend is not connected'));
  }, []);

  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-600">
        Partner Portal
      </p>
      <h1 className="mb-4 text-4xl font-bold text-slate-900">
        Welcome to MobiDrag Partner Portal
      </h1>
      <p className="mb-6 max-w-2xl text-slate-600">
        Manage partner activity, track onboarding, and connect your operations
        from one dashboard.
      </p>
      <div className="rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
        API Status: <span className="font-semibold">{status}</span>
      </div>
    </section>
  );
}

export default Home;
