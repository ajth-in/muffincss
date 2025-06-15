import type { AtRule, Declaration } from "postcss";
import type { SelectorComponents } from "./parse-selector";
import type { MuffinConfig } from "../types";
import { x86 } from "murmurhash3js";

const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9]/g, "_");

const constructUtilityClassName = (
  declaration: Declaration,
  selector: SelectorComponents,
  options: Required<MuffinConfig>,
  context?: { parentAtRule?: AtRule },
): string => {
  const { parentAtRule } = context ?? {};

  const rawParts = [
    declaration.prop,
    declaration.value,
    selector.pseudoClasses,
    parentAtRule?.name,
    parentAtRule?.params,
  ];

  const sanitizedName = rawParts
    .filter((part): part is string => !!part?.length)
    .map(sanitize)
    .join("");

  return options.hash
    ? `${options.prefix}${x86.hash32(sanitizedName).toString(16)}`
    : sanitizedName;
};

export default constructUtilityClassName;
