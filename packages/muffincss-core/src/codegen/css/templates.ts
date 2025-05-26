import type { FileGenType } from "../../types";

export const templates: FileGenType[] = [
  {
    type: "cjs",
    content: `"use strict";
const classMap = require("../_resolved");
const {mergeResolved} = require("@muffincss/postcss/tools");
function css(classNames) {
  return mergeResolved(classNames,classMap )
}
module.exports = css;
`,
  },
  {
    type: "esm",
    content: `import classMap from "../_resolved";
import {mergeResolved} from "@muffincss/postcss/tools";
function css(classNames) {
  return mergeResolved(classNames,classMap)
}
export default css;
`,
  },
  {
    type: "dts",
    content: `import classMap from "../_resolved";
declare function css(classNames: (keyof typeof classMap | (string & {}))[]): string;
export default css;
`,
  },
];
