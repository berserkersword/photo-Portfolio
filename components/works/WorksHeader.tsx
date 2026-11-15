import Link from "next/link";
import styles from "./WorksHeader.module.css";

interface Props {
  active: "photo" | "video";
  photoCount: number;
  videoCount: number;
}

export default function WorksHeader({ active, photoCount, videoCount }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <h1 className="serif rv">
          <em>work.</em>
        </h1>
        <p className={`${styles.lead} rv`}>
          Photo series and short films — portraits, fashion, weddings and stories in
          between. Pick a series to see it in full.
        </p>
      </div>

      <nav className={`${styles.tabs} rv`} aria-label="Work type">
        <Link
          href="/works"
          className={active === "photo" ? styles.on : ""}
          aria-current={active === "photo" ? "page" : undefined}
        >
          Photo <sup>{photoCount}</sup>
        </Link>
        <Link
          href="/works/video"
          className={active === "video" ? styles.on : ""}
          aria-current={active === "video" ? "page" : undefined}
        >
          Video <sup>{videoCount}</sup>
        </Link>
      </nav>
    </header>
  );
}
