export const cjsTemplate = `"use strict";
const classMap = require("../_resolved");
const {mergeResolved} = require("@muffincss/postcss/tools");
function css(classNames) {
  return mergeResolved(classNames,classMap )
}
module.exports = css;
`;

export const dtsTemplate = `import classMap from "../_resolved";
declare function css(classNames: (keyof typeof classMap | (string & {}))[]): string;
export default css;
`;

export const mjsTemplate = `import classMap from "../_resolved";
import {mergeResolved} from "@muffincss/postcss/tools";
function css(classNames) {
  return mergeResolved(classNames,classMap)
}
export default css;
`;
