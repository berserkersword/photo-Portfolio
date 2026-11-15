import Image from "next/image";
import Link from "next/link";
import { images } from "@/lib/data";
import styles from "./AboutBanner.module.css";

export default function AboutBanner() {
  return (
    <section className={styles.about}>
      <Image src={images.about} alt="" fill sizes="100vw" className={styles.img} />
      <div className={styles.copy}>
        <h2 className="serif rv">
          Shaped by <em>light.</em>
          <br />
          Driven by <em>story.</em>
        </h2>
        <Link href="/about" className="btn rv">
          About me
        </Link>
      </div>
    </section>
  );
}
