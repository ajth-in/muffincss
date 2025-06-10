"use client";
import { MoonStar, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import css from "~/_muffin/css";
import Cookies from "js-cookie";
const THEME_KEY = "theme";
export default function ThemeSwitch() {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);

  // Set initial theme after component mounts (client-side only)
  useEffect(() => {
    const theme = Cookies.get(THEME_KEY);
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
      Cookies.set(THEME_KEY, "dark");
    } else {
      classes.forEach((item) => {
        root.classList.remove(item);
      });
      Cookies.set(THEME_KEY, "light");
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
