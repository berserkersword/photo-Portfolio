"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox from "@/components/Lightbox";
import type { AlbumPhoto } from "@/lib/types";
import styles from "./AlbumGallery.module.css";

/** Albom ichi: rasmlar o'z formatida (4:5, 3:2, 9:16) qirqilmasdan teriladi */
export default function AlbumGallery({ name, photos }: { name: string; photos: AlbumPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);

  const items = photos.map((p, i) => ({
    src: p.src,
    alt: `${name} ${i + 1}`,
    ratio: p.width / p.height,
    caption: <em>{name}</em>,
  }));

  return (
    <>
      <div className={styles.masonry}>
        {photos.map((p, i) => (
          <button
            key={`${p.src}-${i}`}
            type="button"
            className={`${styles.item} rv`}
            onClick={() => setOpen(i)}
            aria-label={`Open photo ${i + 1}`}
          >
            <Image
              src={p.src}
              alt={`${name} ${i + 1}`}
              width={p.width}
              height={p.height}
              sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
              className={styles.img}
              priority={i < 3}
            />
          </button>
        ))}
      </div>

      <Lightbox items={items} index={open} onChange={setOpen} />
    </>
  );
}
