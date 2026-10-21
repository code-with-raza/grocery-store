import { useEffect, useRef } from "react";
import { API } from "../lib/api.js";

export default function GoogleSignIn({ onUser, onError }) {
  const container = useRef(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  useEffect(() => {
    if (!clientId) return;
    const draw = () => {
      window.google?.accounts.id.initialize({ client_id: clientId, callback: async ({ credential }) => {
        try { const response = await fetch(`${API}/auth/google`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ credential }) }); const result = await response.json(); if (!response.ok) throw new Error(result.message); onUser(result.data.user); } catch (error) { onError(error.message || "Google sign-in failed"); }
      } });
      window.google?.accounts.id.renderButton(container.current, { theme: "outline", size: "large", width: container.current?.clientWidth || 320 });
    };
    if (window.google?.accounts) draw(); else { const script = document.createElement("script"); script.src = "https://accounts.google.com/gsi/client"; script.async = true; script.onload = draw; document.head.appendChild(script); return () => script.remove(); }
  }, [clientId, onError, onUser]);
  return clientId ? <div className="google-signin" ref={container} /> : null;
}
