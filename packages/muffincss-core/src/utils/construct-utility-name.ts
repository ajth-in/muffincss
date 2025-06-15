import type { AtRule, Declaration } from "postcss";
import type { SelectorComponents } from "./parse-selector";
import type { MuffinConfig } from "../types";
import { x86 } from "murmurhash3js";
import {
  abbreviations,
  atRuleAbbreviations,
  pseudoAbbreviations,
} from "./abbr";

const sanitize = (str: string) => str.replace(/[^a-zA-Z0-9-]/g, "_");

const getParentAtRuleString = (parentAtRule?: AtRule): string => {
  if (!parentAtRule) return "";
  const name = atRuleAbbreviations[parentAtRule.name] ?? parentAtRule.name;
  const params = parentAtRule.params.replace(/[^a-zA-Z0-9]/g, "");
  return `${name}-${params}_`;
};

const getPseudoString = ({
  pseudoClasses,
  pseudoElement,
}: SelectorComponents): string => {
  const classPart = pseudoClasses
    ? (pseudoAbbreviations[pseudoClasses] ?? pseudoClasses)
    : "";
  const elementPart = pseudoElement
    ? (pseudoAbbreviations[pseudoElement] ?? pseudoElement)
    : "";

  if (classPart && elementPart) {
    return `-${classPart}-${elementPart}`;
  }
  if (classPart) {
    return `-${classPart}`;
  }
  if (elementPart) {
    return `-${elementPart}`;
  }
  return "";
};

const getDeclarationString = (declaration: Declaration): string => {
  const propAbbr = abbreviations[declaration.prop] ?? declaration.prop;
  const valueAbbr = abbreviations[declaration.value] ?? declaration.value;
  return `${propAbbr}_${valueAbbr}`;
};

const constructUtilityClassName = (
  declaration: Declaration,
  selector: SelectorComponents,
  options: Required<MuffinConfig>,
  context: { parentAtRule?: AtRule } = {},
): string => {
  const { parentAtRule } = context;

  const classNameParts = [
    getParentAtRuleString(parentAtRule),
    getDeclarationString(declaration),
    getPseudoString(selector),
  ];

  const rawClassName = classNameParts.map(sanitize).join("");

  if (options.hash) {
    const hash = x86.hash32(rawClassName).toString(16);
    return `${options.prefix}${hash}`;
  }

  return rawClassName;
};

export default constructUtilityClassName;
