"use client";

import { useEffect } from "react";

/** Registra el service worker de la PWA (solo en producción: en desarrollo la caché estorba). */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    // Después de la carga, para no competir con los recursos de la página.
    const register = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);
  return null;
}
