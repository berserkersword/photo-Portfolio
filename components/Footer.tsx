import Link from "next/link";
import { site } from "@/lib/data";
import Logo from "./Logo";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Link href="/" aria-label="Home">
            <Logo className={styles.logo} />
          </Link>
          <div className={styles.contact}>
            <h4 className="display">{site.owner}</h4>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          </div>
        </div>

        <div className={styles.col}>
          <h5 className="label">Navigation</h5>
          <ul>
            <li><Link href="/works">Works</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><a href={`mailto:${site.email}`}>Contact</a></li>
          </ul>
        </div>

        <div className={styles.col}>
          <h5 className="label">Socials</h5>
          <div className={styles.socials}>
            <a href={site.socials.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
              </svg>
            </a>
            <a href={site.socials.telegram} aria-label="Telegram" target="_blank" rel="noreferrer">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.4 3.6 2.9 10.7c-1.2.5-1.2 1.2 0 1.6l4.7 1.5 1.8 5.6c.2.6.4.8.9.8.4 0 .6-.2.9-.4l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.7-1.3ZM9.7 14.2l-.4 4-1.5-4.8 10.6-6.7-8.7 7.5Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© 2026 {site.name}. All rights reserved.</span>
        <div>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms &amp; Conditions</a>
        </div>
      </div>
    </footer>
  );
}
