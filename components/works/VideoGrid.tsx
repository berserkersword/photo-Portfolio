"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { VideoWork } from "@/lib/types";
import { previewUrl } from "@/lib/video-src";
import VideoPlayer from "./VideoPlayer";
import styles from "./VideoGrid.module.css";

/**
 * Vertikal (9:16) videolar to'ri.
 * Sichqoncha ustiga kelganda ovozsiz, yengil nusxa o'ynaydi (auteur'dagidek),
 * bosilganda to'liq HLS pleer ochiladi (VideoPlayer).
 */
export default function VideoGrid({ videos }: { videos: VideoWork[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const refs = useRef<(HTMLVideoElement | null)[]>([]);

  const preview = (i: number, play: boolean) => {
    const v = refs.current[i];
    if (!v) return;
    if (play) v.play().catch(() => {});
    else {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <>
      <ul className={styles.grid}>
        {videos.map((v, i) => (
          <li key={v.fileId} className="rv">
            <button
              type="button"
              className={styles.card}
              onClick={() => {
                preview(i, false);
                setOpen(i);
              }}
              onMouseEnter={() => preview(i, true)}
              onMouseLeave={() => preview(i, false)}
              onFocus={() => preview(i, true)}
              onBlur={() => preview(i, false)}
              aria-label={`Play ${v.title}`}
            >
              <video
                ref={(el) => {
                  refs.current[i] = el;
                }}
                src={previewUrl(v.url)}
                poster={v.thumbnailUrl}
                muted
                loop
                playsInline
                preload="none"
              />
              <span className={styles.play} aria-hidden>
                <svg viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className={`${styles.title} serif`}>
                <em>{v.title}</em>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && <VideoModal videos={videos} index={open} onChange={setOpen} />}
    </>
  );
}

function VideoModal({
  videos,
  index,
  onChange,
}: {
  videos: VideoWork[];
  index: number;
  onChange: (i: number | null) => void;
}) {
  const video = videos[index];
  const close = useCallback(() => onChange(null), [onChange]);
  const step = useCallback(
    (d: number) => onChange((index + d + videos.length) % videos.length),
    [index, videos.length, onChange],
  );

  useEffect(() => {
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
  }, [close, step]);

  return (
    <div className={styles.modal} role="dialog" aria-modal="true" onClick={close}>
      <button className={`${styles.btn} ${styles.close}`} aria-label="Close" onClick={close}>
        ✕
      </button>
      <button
        className={`${styles.btn} ${styles.prev}`}
        aria-label="Previous video"
        onClick={(e) => {
          e.stopPropagation();
          step(-1);
        }}
      >
        ←
      </button>

      <VideoPlayer key={video.fileId} url={video.url} poster={video.thumbnailUrl} />

      <button
        className={`${styles.btn} ${styles.next}`}
        aria-label="Next video"
        onClick={(e) => {
          e.stopPropagation();
          step(1);
        }}
      >
        →
      </button>

      <div className={`${styles.cap} serif`}>
        <em>{video.title}</em>
        <small>
          {index + 1} / {videos.length}
        </small>
      </div>
    </div>
  );
}
