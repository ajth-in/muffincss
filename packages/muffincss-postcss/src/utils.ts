import { AtRule, Declaration, Rule } from "postcss";
import type { AtomicRule } from "./types";
import { x86 } from "murmurhash3js";
export const formatToId = (input: string) =>
  input.replace(/[^a-zA-Z0-9]/g, "_");

export const stringifyDeclaration = (
  decl: Declaration,
  prefix: string,
  hash: boolean,
  mediaQueryParam?: string,
): string => {
  const declarationId = `${decl.prop}-${formatToId(decl.value)}`;
  const out = mediaQueryParam
    ? `${declarationId}-${formatToId(mediaQueryParam)}`
    : declarationId;

  const result = hash
    ? `${prefix}${x86.hash32(out).toString(16)}`
    : `${prefix}${out}`;

  return result;
};

export const generateMediaRules = (
  rules: Map<string, AtomicRule>,
  mediaQuery: string,
) => {
  const mediaRule = new AtRule({ name: "media", params: mediaQuery });

  rules.forEach((data, className) => {
    let selector = `.${className}`;

    const newRule = new Rule({ selector });
    newRule.append(new Declaration({ prop: data.prop, value: data.value }));
    mediaRule.append(newRule);
  });
  return mediaRule;
};

export const generateAtomicRule = (className: string, data: AtomicRule) => {
  const selector = `.${className}`;
  const newRule = new Rule({ selector });
  newRule.append(new Declaration({ prop: data.prop, value: data.value }));
  return newRule;
};
