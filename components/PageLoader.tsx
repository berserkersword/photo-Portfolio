"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import LogoScreen from "./LogoScreen";

/** Logotip kamida shuncha vaqt ko'rinib turadi (millisekund) */
const FIRST_LOAD_MS = 1100;
const NAV_MIN_MS = 650;
/** Biror sabab bilan sahifa almashmasa ham ekran osilib qolmasin */
const SAFETY_MS = 8000;

/**
 * Logotipli yuklanish ekrani:
 *  • sayt birinchi ochilganda;
 *  • ichki havola bosilib boshqa sahifaga o'tilganda — yangi sahifa tayyor bo'lgach yo'qoladi.
 * (Brauzerning ortga/oldinga tugmalarida ko'rsatilmaydi — u yerda tezlik muhimroq.)
 */
export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const startedAt = useRef(0);
  const lastPath = useRef(pathname);

  // Birinchi yuklanish
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), FIRST_LOAD_MS);
    return () => clearTimeout(t);
  }, []);

  // Ichki havola bosilganda — ekranni yopib qo'yamiz
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;

      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return; // tashqi havola
      if (url.pathname === location.pathname) return; // shu sahifa yoki #bo'lim

      startedAt.current = Date.now();
      setVisible(true);
    };
    // capture: Next.js <Link> preventDefault() qilishidan OLDIN ushlab olamiz
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Yangi sahifa chizilgach — minimal vaqt o'tgandan keyin ekranni ochamiz
  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    const wait = Math.max(0, NAV_MIN_MS - (Date.now() - startedAt.current));
    const t = setTimeout(() => setVisible(false), wait);
    return () => clearTimeout(t);
  }, [pathname]);

  // Xavfsizlik: ekran hech qachon osilib qolmasin
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => setVisible(false), SAFETY_MS);
    return () => clearTimeout(t);
  }, [visible]);

  return <LogoScreen hidden={!visible} />;
}
