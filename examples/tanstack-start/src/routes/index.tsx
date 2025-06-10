import { createFileRoute } from "@tanstack/react-router";
import FeaturesSection from "~/components/common/Features";
import Hero from "~/components/common/hero";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <Hero />
      <FeaturesSection />
      <footer>MIT License © {new Date().getFullYear()}-Present ajth.in</footer>
    </main>
  );
}
