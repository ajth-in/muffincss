import css from "~/_muffin/css";
import ThemeSwitch from "../ThemeSwitch";
import { Github } from "lucide-react";
import Link from "next/link";

const Header = () => {
  const links = [
    {
      href: "/",
      text: "Docs",
    },
    {
      href: "https://github.com/ajth-in/muffincss",
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
          <Link key={args.href} {...args} className={css(["nav-link"])}>
            {text}
          </Link>
        ))}

        <ThemeSwitch />
      </nav>
    </header>
  );
};

export default Header;
