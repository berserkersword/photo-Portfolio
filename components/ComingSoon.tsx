import styles from "./ComingSoon.module.css";

/** Hali tayyor bo'lmagan sahifalar uchun vaqtinchalik bo'sh ekran */
export default function ComingSoon({ title }: { title: string }) {
  return (
    <section className={styles.wrap}>
      <div className={styles.frame}>
        <h1 className="serif">
          <em>{title}</em>
        </h1>
        <p className="label">Coming soon</p>
      </div>
    </section>
  );
}
