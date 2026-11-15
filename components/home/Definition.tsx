import styles from "./Definition.module.css";

export default function Definition() {
  return (
    <section className={styles.define} id="visual">
      <h2 className="serif rv">
        <em>visual.</em>
      </h2>
      <div className={`${styles.phon} rv`}>
        [noun]
        <br />
        vis·u·al | \ ˈvi-zhə-wəl \
      </div>
      <p className={`${styles.lead} rv`}>
        A moment shaped by light, framed with purpose and told without words. A
        visual is not just an image or a clip, but the feeling that stays long after
        the screen goes dark.
      </p>
    </section>
  );
}
