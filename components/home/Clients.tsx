import { clients } from "@/lib/data";
import LogoGrid from "./LogoGrid";
import styles from "./Clients.module.css";

/**
 * "Trusted by" — mijozlar logotiplari.
 * Har bir logotipning kengligi nisbatiga (ratio) qarab hisoblanadi: √ratio — keng
 * yozuvlar haddan tashqari katta, kvadrat belgilar esa kichik ko'rinmasligi uchun.
 */
export default function Clients() {
  return (
    <section className={styles.clients}>
      <h3 className="label rv">Trusted by</h3>
      <LogoGrid clients={clients} />
    </section>
  );
}
