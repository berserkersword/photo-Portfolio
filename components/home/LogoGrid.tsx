"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Clients.module.css";

export interface ClientLogo {
  name: string;
  slug: string;
  ratio: number;
  scale?: number;
}

/**
 * Logotiplar to'ri:
 *  • bo'lim ekranga kirganda logotiplar birin-ketin paydo bo'ladi (bir marta);
 *  • sichqoncha har safar ustiga kelganda — logotip shakli ichida yorug'lik o'tadi (shine).
 * Klasslar React state orqali beriladi — hydration bilan to'qnashmaydi.
 */
export default function LogoGrid({ clients }: { clients: ClientLogo[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} className={`${styles.grid} ${visible ? styles.visible : ""}`} data-reveal-skip>
      {clients.map((c, i) => {
        const src = `/clients/${c.slug}.svg`;
        return (
          <li
            key={c.slug}
            className={styles.item}
            style={
              {
                "--i": i,
                "--w": (Math.sqrt(c.ratio) * (c.scale ?? 1)).toFixed(3),
                "--s": c.scale ?? 1,
                "--src": `url("${src}")`,
              } as React.CSSProperties
            }
          >
            <span className={styles.logo}>
              {/* eslint-disable-next-line @next/next/no-img-element -- kichik SVG, optimizatsiya kerak emas */}
              <img src={src} alt={c.name} loading="lazy" decoding="async" />
            </span>
          </li>
        );
      })}
    </ul>
  );
}
