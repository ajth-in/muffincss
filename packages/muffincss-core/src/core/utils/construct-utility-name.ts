import type { AtRule, Declaration } from "postcss";
import type { SelectorComponents } from "./parse-selector";
import type { MuffinConfig } from "../../types";
import { x86 } from "murmurhash3js";

const formatToId = (input: string) => input.replace(/[^a-zA-Z0-9]/g, "_");

const constructUtilityClassName = (
  declaration: Declaration,
  selector: SelectorComponents,
  options: Required<MuffinConfig>,
  context?: { parentAtRule?: AtRule },
) => {
  const { parentAtRule } = context ?? {};
  const utilityClassName = [
    declaration.prop,
    declaration.value,
    selector.pseudoClasses,
    parentAtRule?.name,
    parentAtRule?.params,
  ]
    .filter((item): item is string => !!item?.length)
    .map((item) => formatToId(item))
    .join("");

  const withPrefix = (value: string) => `${options.prefix}${value}`;
  return options?.hash
    ? withPrefix(x86.hash32(utilityClassName).toString(16))
    : withPrefix(utilityClassName);
};

export default constructUtilityClassName;
