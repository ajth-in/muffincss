import type { AtRule, Declaration } from "postcss";
import type { SelectorComponents } from "./parse-selector";
import type { MuffinConfig } from "../types";
import { x86 } from "murmurhash3js";
import { abbreviations, pseudoAbbreviations } from "./abbr";

const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9\-]/g, "_");

const stringifyParentAtRule = (parentAtRule?: AtRule) => {
  if (!parentAtRule) return;
  const atRuleAbrev = (() => {
    if (parentAtRule.name === "media") return "m";
    if (parentAtRule.name === "container") return "c";
    return parentAtRule.name;
  })();
  return `${atRuleAbrev}-${parentAtRule.params.replace(/[^a-zA-Z0-9]/g, "")}_`;
};

const stringifyPsedo = ({
  pseudoClasses,
  pseudoElement,
}: SelectorComponents) => {
  const selector = pseudoClasses
    ? (pseudoAbbreviations[pseudoClasses] ?? pseudoClasses)
    : "";
  const element = pseudoElement
    ? (pseudoAbbreviations[pseudoElement] ?? pseudoElement)
    : "";
  return `-${selector}${element ? `-${element}` : ""}`;
};
const stringifyDeclaration = (declaration: Declaration) => {
  const prop = abbreviations[declaration.prop] ?? declaration.prop;
  const value = abbreviations[declaration.value] ?? declaration.value;
  return `${prop}_${value}`;
};

const constructUtilityClassName = (
  declaration: Declaration,
  selector: SelectorComponents,
  options: Required<MuffinConfig>,
  context?: { parentAtRule?: AtRule },
): string => {
  const { parentAtRule } = context ?? {};

  const rawParts = [
    stringifyParentAtRule(parentAtRule),
    stringifyDeclaration(declaration),
    stringifyPsedo(selector),
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
