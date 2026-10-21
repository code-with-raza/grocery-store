// Keep API configuration in one place so every page uses the same backend origin.
export const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
export const CATALOG_API = import.meta.env.VITE_CATALOG_API_URL || API.replace(/\/api\/v1\/?$/, "");
