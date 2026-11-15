"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import Lightbox from "@/components/Lightbox";
import type { PhotoWork } from "@/lib/types";
import styles from "./LatestWork.module.css";

const AUTOPLAY_MS = 6000;

/** --ratio "4 / 5" (aspect-ratio uchun), --r 0.8 (o'lcham hisoblash uchun) */
const ratioVars = ({ width: w, height: h }: PhotoWork) => {
  return { "--ratio": `${w} / ${h}`, "--r": w / h } as React.CSSProperties;
};

const pad = (n: number) => String(n).padStart(2, "0");

export default function LatestWork({ photos }: { photos: PhotoWork[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  /** Carouselni i-slaydga aylantiradi (oxiridan boshiga qaytadi) */
  const goTo = useCallback(
    (i: number) => {
      const track = trackRef.current;
      if (!track) return;
      const idx = (i + photos.length) % photos.length;
      track.scrollTo({ left: idx * track.clientWidth, behavior: "smooth" });
    },
    [photos.length],
  );

  // Swipe yoki tugma bilan aylantirilganda faol slaydni aniqlash
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setActive(Math.round(track.scrollLeft / track.clientWidth));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Avtomatik almashish: bo'lim ko'rinib turganda, sichqoncha ustida bo'lmaganda
  useEffect(() => {
    if (!inView || paused || lightbox !== null) return;
    const t = setTimeout(() => goTo(active + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, inView, paused, lightbox, goTo]);

  const current = photos[active] ?? photos[0];
  const lightboxItems = photos.map((p) => {
    return {
      src: p.src,
      alt: `${p.client} — ${p.title}`,
      ratio: p.width / p.height,
      caption: (
        <>
          {p.client} <span className={styles.sep}>|</span> <em>{p.title}</em>
        </>
      ),
    };
  });

  return (
    <section className={styles.section} ref={sectionRef} aria-label="Latest work">
      {/* ---------- chap: matn ---------- */}
      <div className={styles.text}>
        <div className={styles.head}>
          <h3 className="label">Latest work</h3>
          <span className={styles.counter}>
            {pad(active + 1)} <span>/ {pad(photos.length)}</span>
          </span>
        </div>

        {/* key o'zgarganda blok qayta chiziladi → matn animatsiya bilan almashadi */}
        <div key={current.slug} className={styles.copy} aria-live="polite">
          <p className={styles.client}>{current.client}</p>
          <h2 className="serif">
            <em>{current.title}</em>
          </h2>
          <p className={styles.desc}>{current.description}</p>
          <dl className={styles.meta}>
            <div>
              <dt>Date</dt>
              <dd>{current.date}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{current.location}</dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{current.format}</dd>
            </div>
          </dl>
          <button type="button" className="btn" onClick={() => setLightbox(active)}>
            View full photo
          </button>
        </div>
      </div>

      {/* ---------- o'ng: carousel ---------- */}
      <div className={styles.carousel}>
        <div
          className={styles.stage}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className={styles.track}
            ref={trackRef}
            data-reveal-skip
            tabIndex={0}
            aria-roledescription="carousel"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                goTo(active + 1);
              }
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                goTo(active - 1);
              }
            }}
          >
            {photos.map((p, i) => (
              <div
                key={p.id}
                className={styles.slide}
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${photos.length}`}
                aria-hidden={i !== active}
              >
                <button
                  type="button"
                  className={styles.frame}
                  style={ratioVars(p)}
                  onClick={() => setLightbox(i)}
                  tabIndex={i === active ? 0 : -1}
                  aria-label={`Open ${p.title}`}
                >
                  <Image
                    src={p.src}
                    alt={`${p.client} — ${p.title}`}
                    fill
                    sizes="(max-width: 767px) 100vw, 55vw"
                    className={styles.photo}
                    priority={i === 0}
                  />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`${styles.arrow} ${styles.prev}`}
            aria-label="Previous photo"
            onClick={() => goTo(active - 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M16 5 7 12l9 7Z" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            aria-label="Next photo"
            onClick={() => goTo(active + 1)}
          >
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="m8 5 9 7-9 7Z" />
            </svg>
          </button>
        </div>

        <div className={styles.markers} role="tablist" aria-label="Choose photo">
          {photos.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${i + 1}: ${p.title}`}
              className={i === active ? styles.markerOn : ""}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      </div>

      {/* ---------- katta ko'rish oynasi ---------- */}
      <Lightbox items={lightboxItems} index={lightbox} onChange={setLightbox} />
    </section>
  );
}
