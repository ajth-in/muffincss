import { MoonStar, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import css from "~/_muffin/css";

export default function ThemeSwitch() {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  // Set initial theme after component mounts (client-side only)
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = theme === "dark" || (!theme && prefersDark);

    setDarkMode(isDark);
  }, []);

  // Apply class and save preference
  useEffect(() => {
    if (darkMode === null) return; // Don't apply theme until darkMode is determined
    const root = document.documentElement;
    const classes = css(["dark"]).split(" ");
    if (darkMode) {
      classes.forEach((item) => {
        root.classList.add(item);
      });
      localStorage.setItem("theme", "dark");
    } else {
      classes.forEach((item) => {
        root.classList.remove(item);
      });
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (darkMode === null) return null; // Optionally render a loading state

  return (
    <Button
      className={css(["toggle"])}
      onClick={() => setDarkMode((prev) => !prev)}
    >
      {darkMode ? (
        <Sun className={css(["toggle--icon", "toggle--icon-light"])} />
      ) : (
        <MoonStar className={css(["toggle--icon", "toggle--icon-dark"])} />
      )}
    </Button>
  );
}
