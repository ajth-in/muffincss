import classMap from "../_resolved";
declare function css(
  classNames: (keyof typeof classMap | (string & {}))[],
): string;
export default css;
