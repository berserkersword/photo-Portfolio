"use client";

import { useEffect } from "react";

/**
 * Saytga kirilganda /api/visit ga bir marta xabar beradi.
 * Bitta tab ichida sahifadan sahifaga o'tish yangi tashrif hisoblanmaydi
 * (sessionStorage). Tabni yopib qayta kirsa — yangi tashrif.
 */
export default function VisitTracker() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("iv-visit")) return;
      sessionStorage.setItem("iv-visit", "1");
    } catch {}

    const body = JSON.stringify({
      path: location.pathname,
      referrer: document.referrer,
      screen: `${screen.width}×${screen.height}`,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    if (!navigator.sendBeacon?.("/api/visit", new Blob([body], { type: "text/plain" }))) {
      fetch("/api/visit", { method: "POST", body, keepalive: true }).catch(() => {});
    }
  }, []);

  return null;
}
