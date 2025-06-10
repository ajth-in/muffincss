import Hero from "~/components/common/hero";
import FeaturesSection from "~/components/common/Features";
export default function Home() {
  return <main>
      <Hero />
      <FeaturesSection />
      <footer>MIT License © {new Date().getFullYear()}-Present ajth.in</footer>
    </main>
}
