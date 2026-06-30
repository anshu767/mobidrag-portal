import { useState } from 'react';
import api from '../api/axios';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/auth/login', formData);
      setMessage(response.data.message);
    } catch (error) {
      // Detailed diagnostic logging — check these in the mobile browser's
      // remote devtools console (or `adb logcat` / Safari Web Inspector for
      // an in-app WebView) to see exactly what's failing.
      console.log('Login error object:', error);
      console.log('error.message:', error.message);
      console.log('error.code:', error.code);
      console.log('error.response:', error.response);
      console.log('error.config:', error.config);

      if (error.response) {
        // The request reached the backend and the backend responded with
        // an error status (400/401/500). Show its actual message — this is
        // NOT a connectivity problem, so don't say "could not connect".
        setMessage(error.response.data?.message || `Login failed (status ${error.response.status})`);
      } else if (error.request) {
        // The request was sent but no response ever came back — this is a
        // genuine network/CORS/DNS/timeout failure. error.code is the most
        // useful field here: "ECONNABORTED" = timeout, "ERR_NETWORK" =
        // could not reach the host at all (DNS, no internet, CORS preflight
        // rejected before a response body was readable), etc.
        if (error.code === 'ECONNABORTED') {
          setMessage('The server took too long to respond. Please try again.');
        } else {
          setMessage('Could not connect to server. Please check your internet connection and try again.');
        }
      } else {
        // Something went wrong setting up the request itself (rare —
        // usually a bug in the request config, not a connectivity issue).
        setMessage(error.message || 'Login request failed');
      }
    }
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Partner Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            id="email"
            name="email"
            onChange={handleChange}
            placeholder="partner@mobidrag.com"
            type="email"
            value={formData.email}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
            id="password"
            name="password"
            onChange={handleChange}
            placeholder="Enter password"
            type="password"
            value={formData.password}
          />
        </div>
        <button
          className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          type="submit"
        >
          Login
        </button>
      </form>
      {message && <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">{message}</p>}
    </section>
  );
}

export default Login;