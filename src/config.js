function getApiBase() {
  const env = import.meta.env.VITE_API_URL ?? "";
  if (env) return String(env).replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:5000";
  }
  return "";
}

const base = getApiBase();
export const API = base ? `${base}/api` : "/api";
