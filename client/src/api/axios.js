import axios from "axios";

// Always point at the production backend. No localhost fallback —
// this must never depend on import.meta.env / process.env at build time
// silently falling back to a dev URL on mobile builds.
const BASE_URL = "https://mobidrag-portal.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // Render free-tier cold starts can take 20-50s on the
                   // *first* request after idling. 15s was too aggressive —
                   // that alone can produce a network-looking failure even
                   // though the server is fine, just asleep.
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Diagnostic interceptors ───────────────────────────────────────────────
// Logs the EXACT URL axios resolves to (baseURL + url), so you can confirm
// in the console that requests are really going to
// https://mobidrag-portal.onrender.com/api/... and not somewhere else
// (e.g. a stale service worker, a different env var picked up at build
// time, or a relative URL resolving against the page's own origin).
api.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log("[api] →", config.method?.toUpperCase(), fullUrl);
    return config;
  },
  (error) => {
    console.log("[api] request setup error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("[api] ←", response.status, response.config.url);
    return response;
  },
  (error) => {
    // Centralized raw logging for every failed request, regardless of where
    // it's called from. This always fires before any per-call catch block.
    console.log("[api] request failed:", {
      url: `${error.config?.baseURL || ""}${error.config?.url || ""}`,
      method: error.config?.method,
      code: error.code,
      message: error.message,
      status: error.response?.status,
      responseData: error.response?.data,
      hasResponse: !!error.response,
      hasRequest: !!error.request,
    });
    return Promise.reject(error);
  }
);

export default api;