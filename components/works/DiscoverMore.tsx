import Link from "next/link";
import styles from "./DiscoverMore.module.css";

/** Auteur'dagi "Discover More" ajratgichi — boshqa bo'limga havola */
export default function DiscoverMore({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className={styles.row} data-reveal>
      <span className="serif">
        Discover <em>{label}</em>
      </span>
      <span className={styles.line} aria-hidden />
      <span className={styles.arrow} aria-hidden>
        →
      </span>
    </Link>
  );
}
