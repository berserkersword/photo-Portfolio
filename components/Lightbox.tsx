"use client";

import Image from "next/image";
import { useCallback, useEffect, type ReactNode } from "react";
import styles from "./Lightbox.module.css";

export interface LightboxItem {
  src: string;
  alt: string;
  /** kenglik / balandlik — rasm qirqilmasdan sig'ishi uchun */
  ratio: number;
  caption?: ReactNode;
}

interface Props {
  items: LightboxItem[];
  index: number | null;
  onChange: (index: number | null) => void;
}

/** Rasmni to'liq ekranda ko'rsatish: ← → almashtiradi, Esc yopadi */
export default function Lightbox({ items, index, onChange }: Props) {
  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onChange((index + d + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, step]);

  if (index === null) return null;
  const item = items[index];
  const many = items.length > 1;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={close}>
      <button className={`${styles.btn} ${styles.close}`} aria-label="Close" onClick={close}>
        ✕
      </button>

      {many && (
        <button
          className={`${styles.btn} ${styles.prev}`}
          aria-label="Previous photo"
          onClick={(e) => {
            e.stopPropagation();
            step(-1);
          }}
        >
          ←
        </button>
      )}

      <div
        className={styles.frame}
        style={{ "--r": item.ratio } as React.CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <Image key={item.src} src={item.src} alt={item.alt} fill sizes="90vw" className={styles.img} priority />
      </div>

      {many && (
        <button
          className={`${styles.btn} ${styles.next}`}
          aria-label="Next photo"
          onClick={(e) => {
            e.stopPropagation();
            step(1);
          }}
        >
          →
        </button>
      )}

      <div className={`${styles.cap} serif`}>
        {item.caption}
        <small>
          {index + 1} / {items.length}
        </small>
      </div>
    </div>
  );
}
