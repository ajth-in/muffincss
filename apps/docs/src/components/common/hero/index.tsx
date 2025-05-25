import css from "~/muffin/css";

export default function Hero() {
  return (
    <section className={css(["hero"])}>
      <div className={css(["hero-content"])}>
        <h1 className={css(["hero-title"])}>
          <span className={css(["hero-brand"])}>Shiki 式</span>
          <br />
          Syntax highlighter
        </h1>
        <p className={css(["hero-subtitle"])}>
          A beautiful yet powerful syntax highlighter
        </p>
        <div className={css(["hero-actions"])}>
          <a
            href="/getting-started"
            className={css(["button", "button--primary"])}
          >
            Get Started
          </a>
          <a
            href="/installation"
            className={css(["button", "button--secondary"])}
          >
            Installation
          </a>
        </div>
      </div>
      <div className={css(["hero-codeblock"])}>hi</div>
    </section>
  );
}
