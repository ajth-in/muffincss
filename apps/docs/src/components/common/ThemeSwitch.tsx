import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div>
      <h1>Hello World</h1>
      <button onClick={() => setDarkMode((prev) => !prev)}>
        Toggle {darkMode ? "Light" : "Dark"} Mode
      </button>
    </div>
  );
}
