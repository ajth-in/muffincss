import css from "~/muffin/css";
import ThemeSwitch from "../ThemeSwitch";
import { Github } from "lucide-react";
import { Link } from "@tanstack/react-router";

const Header = () => {
  const links = [
    {
      to: "/",
      text: "Docs",
    },
    {
      to: "https://github.com/ajth-in/muffincss",
      target: "_blank",
      rel: "noopener noreferrer",
      text: <Github />,
    },
  ];
  return (
    <header className={css(["header"])}>
      <div className={css(["logo"])}>MuffinCSS</div>
      <nav className={css(["nav"])}>
        {links.map(({ text, ...args }) => (
          <Link key={args.to} {...args} className={css(["nav-link"])}>
            {text}
          </Link>
        ))}

        <ThemeSwitch />
      </nav>
    </header>
  );
};

export default Header;
