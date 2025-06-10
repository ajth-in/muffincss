import classMap from "../_resolved";
import {mergeResolved} from "@muffincss/postcss/tools";
function css(classNames) {
  return mergeResolved(classNames,classMap)
}
export default css;
