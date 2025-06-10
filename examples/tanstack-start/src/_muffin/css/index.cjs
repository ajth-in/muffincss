"use strict";
const classMap = require("../_resolved");
const {mergeResolved} = require("@muffincss/postcss/tools");
function css(classNames) {
  return mergeResolved(classNames,classMap )
}
module.exports = css;
