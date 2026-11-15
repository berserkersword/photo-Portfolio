"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./Hero.module.css";

/**
 * public/main.mp4 — HEVC (hvc1), 1920×1080.
 * HEVC'ni o'ynata olmaydigan brauzerlarda (masalan Firefox) poster kadr ko'rinadi.
 */
const VIDEO = "/main.mp4";
const POSTER = "/main-poster.jpg";

export default function Hero() {
  const ref = useRef<HTMLVideoElement>(null);

  // React `muted` atributini serverda HTML'ga yozmaydi — autoplay ishonchli
  // ishlashi uchun brauzerda ovozni o'chirib, qo'lda ishga tushiramiz
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <section className={styles.hero} data-reveal-skip>
      <div className={styles.frame}>
        <video
          ref={ref}
          className={styles.video}
          src={VIDEO}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />

        <div className={styles.copy}>
          <h1 className={`display ${styles.in}`}>
            Crafting visual
            <br />
            stories
          </h1>
          <p className={`serif ${styles.in}`}>
            Captured with <em>intention.</em>
          </p>
          <Link href="/about" className={`btn ${styles.in}`}>
            Get in touch
          </Link>
        </div>

        <a href="#visual" className={styles.cue}>
          Scroll down
        </a>
      </div>
    </section>
  );
}
