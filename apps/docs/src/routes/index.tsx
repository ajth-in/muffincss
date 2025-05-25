import { createFileRoute } from "@tanstack/react-router";
import Hero from "~/components/common/hero";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <Hero />
    </main>
  );
}
