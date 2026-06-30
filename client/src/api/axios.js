import axios from "axios";

// Always point at the production backend. No localhost fallback —
// this must never depend on import.meta.env / process.env at build time
// silently falling back to a dev URL on mobile builds.
const BASE_URL = "https://mobidrag-portal.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Render free-tier cold starts can take several seconds;
                   // without this, some mobile WebViews/browsers apply their
                   // own much shorter timeout and throw a generic network error.
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;