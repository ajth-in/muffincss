import { Link } from "@tanstack/react-router";
import css from "~/muffin/css";
const actions = [
  {
    href: "/getting-started",
    text: "Get Started",
    variant: "primary",
  },
  {
    href: "/installation",
    text: "Installation",
    variant: "secondary",
  },
];

export default function Hero() {
  return (
    <section className={css(["hero"])}>
      <div className={css(["hero-content"])}>
        <h1 className={css(["hero-title"])}>
          <span className={css(["hero-brand"])}>🧁 Muffin CSS</span>
          <br />
          CSS pre-processor
        </h1>
        <p className={css(["hero-subtitle"])}>
          Transform plain CSS into atomic, type-safe utilities{" "}
        </p>
        <div className={css(["hero-actions"])}>
          {actions.map((action) => (
            <Link
              className={css(["button", `button--${action.variant}`])}
              key={action.text}
              to={action.href}
            >
              {action.text}
            </Link>
          ))}
        </div>
      </div>
      <div className={css(["hero-codeblock"])}>hi</div>
    </section>
  );
}
