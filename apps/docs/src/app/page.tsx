import css from "../muffincss/css";

const Greeting: React.FC = () => {
  return (
    <div className={css(["greeting-container"])}>
      <h1 className={css(["greeting-title"])}>Hello, welcome to my site!</h1>
      <button className={css(["button"])}>Hello</button>
    </div>
  );
};

export default Greeting;
