import atomize from "../../muffincss/css.mjs";
const Greeting: React.FC = () => {
  return (
    <div className={atomize("greeting-container")}>
      <h1 className={atomize("greeting-title")}>Hello, welcome to my site!</h1>
    </div>
  );
};

export default Greeting;
