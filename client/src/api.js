const BASE = (
  import.meta.env.VITE_API_BASE_URL || "https://user-analytics-application-nhfz.onrender.com/api"
).replace(/\/$/, "");

async function get(path) {
  const response = await fetch(BASE + path);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Request failed (${response.status})`);
  }

  return response.json();
}

export const getSessions = () => get("/sessions");

export const getSessionEvents = (id) =>
  get(`/sessions/${encodeURIComponent(id)}/events`);

export const getPages = () => get("/pages");

export const getHeatmap = (url) =>
  get(`/heatmap?url=${encodeURIComponent(url)}`);
