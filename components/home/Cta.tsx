import Image from "next/image";
import { images, site } from "@/lib/data";
import styles from "./Cta.module.css";

export default function Cta() {
  return (
    <section className={styles.cta}>
      <Image src={'/horizontal.jpg'} alt="" fill sizes="100vw" className={styles.img} />
      <div className={styles.copy}>
        <h2 className="serif rv">
          Have a <em>project</em> in mind?
        </h2>
        <a href={`mailto:${site.email}`} className="btn rv">
          Let&apos;s create
        </a>
      </div>
    </section>
  );
}
