import styles from "./Logo.module.css";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`${styles.logo} ${className}`} aria-label="islomVisual">
      <em>Islom</em>
      <b>Visual</b>
      <sup>®</sup>
    </span>
  );
}
