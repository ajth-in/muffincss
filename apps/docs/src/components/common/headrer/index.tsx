import Link from "~/components/Link";
import css from "~/muffin/css";
import ThemeSwitch from "../ThemeSwitch";

const Header = () => {
  return (
    <header className={css(["header"])}>
      <Link className={css(["link"])} to="/">
        🧁 MuffinCSS
      </Link>
      <div className={css(["header--section"])}>
        <ThemeSwitch />
        <Link className={css(["header--link"])} to="/documentaion">
          Documentation
        </Link>
      </div>
    </header>
  );
};

export default Header;
