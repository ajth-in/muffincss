import { AtRule, Declaration, Rule } from "postcss";
import type { AtomicRule } from "../types";

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
