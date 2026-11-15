"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Saytdagi deyarli hamma narsa (matn, tugma, rasm, kartochka, footer...) ekranga
 * kirib kelganda yumshoq paydo bo'ladi — bir marta, birin-ketin.
 *
 * Nega Web Animations API (el.animate)?
 *  Klass yoki style atributini o'zgartirmaydi → React hydration bilan to'qnashmaydi
 *  (avvalgi "hydration mismatch" xatosi shu sababli qaytmaydi).
 *
 * O'zining animatsiyasi bor joylar `data-reveal-skip` bilan belgilangan
 * (hero, logotiplar to'ri, carousel lentasi). Modal va yuklanish oynalari ham o'tkazib yuboriladi.
 */

const SELECTOR = "h1,h2,h3,h4,h5,h6,p,dl,li,figure,img,video,button,.btn,blockquote,[data-reveal]";
const SKIP = "[data-reveal-skip],[role=dialog],[role=status],nav,header";

const DURATION = 900;
const STAGGER = 80; // bir vaqtda ko'ringan elementlar orasidagi kechikish
const EASE = "cubic-bezier(0.22, 0.8, 0.24, 1)";
const FIRST_LOAD_DELAY = 1000; // logotipli yuklanish ekrani yo'qolguncha
const NAV_DELAY = 550; // sahifadan sahifaga o'tganda

const HIDDEN: Keyframe = { opacity: 0, translate: "0 26px" };
const SHOWN: Keyframe = { opacity: 1, translate: "0 0" };

export default function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const roots = [document.querySelector("main"), document.querySelector("body > footer")].filter(
      (r): r is HTMLElement => !!r,
    );
    const seen = new WeakSet<Element>();
    const hiding = new Map<Element, Animation>();
    let firstScan = true;
    const isFirstLoad = !(window as { __revealed?: boolean }).__revealed;
    (window as { __revealed?: boolean }).__revealed = true;

    const reveal = (el: Element, delay: number) => {
      hiding.get(el)?.cancel();
      hiding.delete(el);
      el.animate([HIDDEN, SHOWN], { duration: DURATION, delay, easing: EASE, fill: "backwards" });
    };

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.unobserve(e.target);
          reveal(e.target, n++ * STAGGER);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    /** Yangi elementlarni topadi: faqat "eng tashqi"sini oladi (li ichidagi img qayta animatsiya qilinmaydi) */
    const scan = () => {
      const fresh: Element[] = [];
      for (const root of roots) {
        const found = [...root.querySelectorAll(SELECTOR)].filter((el) => !seen.has(el) && !el.closest(SKIP));
        const set = new Set(found);
        for (const el of found) {
          let p = el.parentElement;
          let nested = false;
          while (p && p !== root) {
            if (set.has(p) || seen.has(p)) {
              nested = true;
              break;
            }
            p = p.parentElement;
          }
          if (!nested) fresh.push(el);
        }
      }

      const base = firstScan ? (isFirstLoad ? FIRST_LOAD_DELAY : NAV_DELAY) : 0;
      let n = 0;
      for (const el of fresh) {
        seen.add(el);
        const r = el.getBoundingClientRect();
        const inView = r.top < innerHeight * 0.92 && r.bottom > 0;
        if (inView) {
          reveal(el, base + n++ * STAGGER);
        } else {
          // ekrandan tashqaridagilar ko'rinmas holda kutib turadi
          hiding.set(el, el.animate([HIDDEN, HIDDEN], { duration: 1, fill: "forwards" }));
          io.observe(el);
        }
      }
      firstScan = false;
    };

    // keyinroq qo'shilgan kontent (masalan ImageKit'dan kelgan albomlar) ham qamrab olinadi
    let pending = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(scan);
    });
    roots.forEach((r) => mo.observe(r, { childList: true, subtree: true }));

    const start = requestAnimationFrame(scan);
    return () => {
      cancelAnimationFrame(start);
      cancelAnimationFrame(pending);
      mo.disconnect();
      io.disconnect();
      // sahifa almashganda hech narsa "yashirin" holda qolib ketmasin (masalan footer)
      hiding.forEach((a) => a.cancel());
      hiding.clear();
    };
  }, [pathname]);

  return null;
}
