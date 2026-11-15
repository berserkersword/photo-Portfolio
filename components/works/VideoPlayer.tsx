"use client";

import type Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import { hlsUrl, isImageKit } from "@/lib/video-src";
import styles from "./VideoPlayer.module.css";

/**
 * To'liq video pleer.
 *  • ImageKit videolari — HLS (ik-master.m3u8). hls.js orqali eng yuqori sifat
 *    (asl 1080×1920) tanlanadi; hls.js ishlamaydigan eski iOS'da — Safari'ning o'zi.
 *  • "Play on ready": video oldindan READY_SECONDS soniya yuklanmaguncha
 *    boshlanmaydi — loader va foiz ko'rinib turadi, keyin to'xtovsiz o'ynaydi.
 *  • HLS ishlamasa — avtomatik ravishda asl MP4 ga o'tadi.
 */

/** O'ynashdan oldin oldindan yuklanadigan qism (soniya) */
const READY_SECONDS = 6;

interface Level {
  index: number;
  label: string;
}

export default function VideoPlayer({ url, poster }: { url: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [quality, setQuality] = useState<number>(-1); // -1 = Auto
  const [menu, setMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let cancelled = false;
    let started = false;

    /** Joriy joydan oldinda nechchi soniya yuklangan */
    const bufferedAhead = () => {
      const t = video.currentTime;
      for (let i = 0; i < video.buffered.length; i++) {
        if (video.buffered.start(i) <= t + 0.25 && video.buffered.end(i) > t) return video.buffered.end(i) - t;
      }
      return 0;
    };

    /** Yetarlicha yuklangach bir marta play() qiladi */
    const check = () => {
      if (started || cancelled) return;
      const left = Number.isFinite(video.duration) ? video.duration - video.currentTime : Infinity;
      const need = Math.max(0.5, Math.min(READY_SECONDS, left - 0.2));
      const ahead = bufferedAhead();
      setProgress(Math.min(99, Math.round((ahead / need) * 100)));
      if (ahead >= need) {
        started = true;
        setLoading(false);
        video.play().catch(() => {}); // brauzer ruxsat bermasa — foydalanuvchi o'zi bosadi
      }
    };

    const onWaiting = () => started && setLoading(true);
    const onPlaying = () => setLoading(false);
    video.addEventListener("progress", check);
    video.addEventListener("loadeddata", check);
    video.addEventListener("canplaythrough", check);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    const timer = setInterval(check, 250);

    const fallback = () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      setLevels([]);
      video.src = url;
      video.preload = "auto";
      video.load();
    };

    const playNative = () => {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl(url);
        video.addEventListener("error", fallback, { once: true });
      } else fallback();
    };

    if (!isImageKit(url)) {
      fallback();
    } else {
      import("hls.js")
        .then(({ default: HlsLib }) => {
          if (cancelled) return;
          if (!HlsLib.isSupported()) return playNative();

          const hls = new HlsLib({ autoStartLoad: false, maxBufferLength: 30 });
          hlsRef.current = hls;

          hls.on(HlsLib.Events.MANIFEST_PARSED, (_e, data) => {
            const list = data.levels
              .map((l, index) => ({ index, w: l.width, h: l.height }))
              .sort((a, b) => b.w * b.h - a.w * a.h);
            const top = list[0]?.index ?? 0;
            // Eng yuqori sifat (asl o'lcham) dan boshlaydi va unda qoladi
            hls.startLevel = top;
            hls.loadLevel = top;
            setQuality(top);
            setLevels(list.map((l) => ({ index: l.index, label: `${Math.min(l.w, l.h)}p` })));
            hls.startLoad();
          });
          hls.on(HlsLib.Events.ERROR, (_e, data) => {
            if (data.fatal) fallback();
          });
          hls.loadSource(hlsUrl(url));
          hls.attachMedia(video);
        })
        .catch(playNative);
    }

    return () => {
      cancelled = true;
      clearInterval(timer);
      video.removeEventListener("progress", check);
      video.removeEventListener("loadeddata", check);
      video.removeEventListener("canplaythrough", check);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [url]);

  const pick = (index: number) => {
    const hls = hlsRef.current;
    if (hls) hls.currentLevel = index; // -1 = Auto (internet tezligiga qarab)
    setQuality(index);
    setMenu(false);
  };

  const current = quality === -1 ? "Auto" : (levels.find((l) => l.index === quality)?.label ?? "Auto");

  return (
    <div className={styles.wrap} onClick={(e) => e.stopPropagation()}>
      <video ref={ref} className={styles.video} poster={poster} controls playsInline preload="auto" />

      {loading && (
        <span className={styles.loader} aria-hidden>
          <span className={styles.spinner} />
          {progress > 0 && <span className={styles.percent}>{progress}%</span>}
        </span>
      )}

      {levels.length > 0 && (
        <div className={styles.quality}>
          <button type="button" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
            {current}
          </button>
          {menu && (
            <ul>
              {[{ index: -1, label: "Auto" }, ...levels].map((l) => (
                <li key={l.index}>
                  <button
                    type="button"
                    className={l.index === quality ? styles.on : ""}
                    onClick={() => pick(l.index)}
                  >
                    {l.label}
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
