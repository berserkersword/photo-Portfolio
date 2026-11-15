import Logo from "./Logo";
import styles from "./LogoScreen.module.css";

/**
 * Logotipli to'liq ekran (yuklanish oynasi).
 * PageLoader (birinchi yuklanish + sahifalar orasida o'tish) va
 * app/loading.tsx (ma'lumot kutilayotganda) — ikkalasi shu ko'rinishni ishlatadi.
 */
export default function LogoScreen({ hidden = false, delayed = false }: { hidden?: boolean; delayed?: boolean }) {
  return (
    <div
      className={[styles.screen, hidden ? styles.hidden : "", delayed ? styles.delayed : ""].join(" ")}
      role="status"
      aria-live="polite"
      aria-hidden={hidden}
    >
      <Logo className={styles.logo} />
      <span className={styles.bar} aria-hidden />
      <span className={styles.sr}>Loading…</span>
    </div>
  );
}
