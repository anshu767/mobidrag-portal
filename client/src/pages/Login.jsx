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
      // Full diagnostic dump — also visible in console via the axios
      // interceptor in api/axios.js, but surfaced here directly in the UI
      // too, since remote devtools aren't always available on a phone.
      console.log('Login error object:', error);
      console.log('error.message:', error.message);
      console.log('error.code:', error.code);
      console.log('error.response:', error.response);
      console.log('error.config:', error.config);

      const requestUrl = `${error.config?.baseURL || ''}${error.config?.url || ''}`;

      if (error.response) {
        // Request reached the backend; backend responded with an error
        // status (400/401/500). This is NOT a connectivity problem.
        const status = error.response.status;
        const data = error.response.data;
        setMessage(
          `Login failed (HTTP ${status}): ${data?.message || JSON.stringify(data) || 'No error detail returned.'}`
        );
      } else if (error.request) {
        // Request was sent but no response ever came back — genuine
        // network/CORS/DNS/timeout failure. Show the real code/message
        // instead of a generic line, so the actual cause is visible.
        setMessage(
          `Could not reach server. code=${error.code || 'UNKNOWN'} message="${error.message}" url=${requestUrl}`
        );
      } else {
        // Something went wrong setting up the request itself.
        setMessage(`Request setup failed: ${error.message}`);
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