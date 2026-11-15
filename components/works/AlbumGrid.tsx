import Image from "next/image";
import Link from "next/link";
import type { ApiPhotoFolder } from "@/lib/types";
import styles from "./AlbumGrid.module.css";

/** Foto albomlar to'ri: muqova, nom va rasmlar soni */
export default function AlbumGrid({ folders }: { folders: ApiPhotoFolder[] }) {
  if (folders.length === 0) {
    return <p className={styles.empty}>Albomlar hozircha yuklanmadi. Birozdan keyin qayta urinib ko&apos;ring.</p>;
  }

  return (
    <ul className={styles.grid}>
      {folders.map((f, i) => (
        <li key={f.slug} className="rv">
          <Link href={`/works/photo/${encodeURIComponent(f.slug)}`} className={styles.card}>
            <Image
              src={f.coverUrl}
              alt={f.name}
              fill
              sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
              className={styles.img}
              priority={i < 3}
            />
            <span className={styles.info}>
              <span className={`${styles.name} serif`}>
                <em>{f.name}</em>
              </span>
              <span className={styles.count}>{f.count} photos</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
