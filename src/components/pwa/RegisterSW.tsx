"use client";

import { useEffect } from "react";

/** Registra o service worker (instalável + offline básico) apenas em produção. */
export function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Falha de registro não deve quebrar o app.
    });
  }, []);
  return null;
}
