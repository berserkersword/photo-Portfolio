"use client";

import type Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import { hlsUrl, isImageKit } from "@/lib/video-src";
import styles from "./VideoPlayer.module.css";

/**
 * To'liq video pleer.
 *  • ImageKit videolari — HLS (ik-master.m3u8), moslashuvchan sifat
 *    Safari: o'zi o'ynatadi; Chrome/Firefox: hls.js (faqat kerak bo'lganda yuklanadi)
 *  • Boshqa manbalar — oddiy MP4
 *  • HLS ishlamasa — avtomatik ravishda asl MP4 ga o'tadi
 */
export default function VideoPlayer({ url, poster }: { url: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<number[]>([]);
  const [quality, setQuality] = useState<number | "auto">("auto");
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let cancelled = false;

    const fallback = () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      setLevels([]);
      video.src = url;
      video.play().catch(() => {});
    };

    if (!isImageKit(url)) {
      video.src = url;
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hlsUrl(url);
      video.addEventListener("error", fallback, { once: true });
    } else {
      import("hls.js").then(({ default: HlsLib }) => {
        if (cancelled) return;
        if (!HlsLib.isSupported()) return fallback();
        const hls = new HlsLib();
        hlsRef.current = hls;
        hls.on(HlsLib.Events.MANIFEST_PARSED, (_e, data) => {
          const heights = [...new Set(data.levels.map((l) => l.height))].sort((a, b) => b - a);
          setLevels(heights);
        });
        hls.on(HlsLib.Events.ERROR, (_e, data) => {
          if (data.fatal) fallback();
        });
        hls.loadSource(hlsUrl(url));
        hls.attachMedia(video);
      });
    }

    video.play().catch(() => {});
    return () => {
      cancelled = true;
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [url]);

  const pick = (q: number | "auto") => {
    const hls = hlsRef.current;
    if (hls) hls.currentLevel = q === "auto" ? -1 : hls.levels.findIndex((l) => l.height === q);
    setQuality(q);
    setMenu(false);
  };

  return (
    <div className={styles.wrap} onClick={(e) => e.stopPropagation()}>
      <video
        ref={ref}
        className={styles.video}
        poster={poster}
        controls
        autoPlay
        playsInline
        onCanPlay={() => setLoading(false)}
      />

      {loading && <span className={styles.loader} aria-hidden />}

      {levels.length > 0 && (
        <div className={styles.quality}>
          <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
            {quality === "auto" ? "Auto" : `${quality}p`}
          </button>
          {menu && (
            <ul>
              {(["auto", ...levels] as const).map((q) => (
                <li key={q}>
                  <button type="button" className={q === quality ? styles.on : ""} onClick={() => pick(q)}>
                    {q === "auto" ? "Auto" : `${q}p`}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
