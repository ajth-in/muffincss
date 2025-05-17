export const cjsTemplate = `"use strict";
const classMap = require("../_resolved");
// const generateCss = require("@muffincss/utils");
function css(classNames) {
  return classNames.map(item=>classMap['.'+item]).join(" ")
}
module.exports = css;
`;

export const dtsTemplate = `import classMap from "../_resolved";
declare function css(classNames: (keyof typeof classMap | (string & {}))[]): string;
export default css;
`;

export const mjsTemplate = `import classMap from "../_resolved";
// import generateCss from "@muffincss/utils";
function css(classNames) {
  return classNames.map(item=>classMap['.'+item]).join(" ")
}
export default css;
`;
