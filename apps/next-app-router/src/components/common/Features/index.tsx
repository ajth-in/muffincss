import css from "~/_muffin/css";
const features = [
  {
    icon: "🧬",
    title: "Atomic Styles",
    description:
      "All styles are converted to atomic utility classes for maximum reusability and performance.",
  },
  {
    icon: "🔐",
    title: "Type Safety",
    description:
      "Access class names in a type-safe way via a generated css function for confident styling.",
  },
  {
    icon: "⚡",
    title: "Snippets",
    description:
      "Use @cv, @pattern, and @token directives to speed up development with smart code snippets.",
  },
  {
    icon: "🎨",
    title: "Built-in Design System",
    description:
      "Includes a Tailwind-like token library for colors, spacing, typography, and more to streamline development.",
  },
];

export default function FeaturesSection() {
  return (
    <section className={css(["features-container"])}>
      {features.map((feature, i) => (
        <div key={i} className={css(["feature-card"])}>
          <div className={css(["feature-icon"])}>{feature.icon}</div>
          <h3 className={css(["feature-title"])}>{feature.title}</h3>
          <p className={css(["feature-description"])}>{feature.description}</p>
        </div>
      ))}
    </section>
  );
}
