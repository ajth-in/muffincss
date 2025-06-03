import { atRule } from "postcss";
import type RulesProcessor from "../processors/rules";
import type AtRuleProcessor from "../processors/at-rules";
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
const createUtilititylayer = (
  rules: RulesProcessor["parsedRules"],
  atRules: AtRuleProcessor["parsedAtRules"],
) => {
  const utilitiesLayer = atRule({ name: "layer", params: "utilities" });
  atRules.forEach((rules, mediaQuery) => {
    const mediaRule = generateMediaRules(rules, mediaQuery);
    utilitiesLayer.append(mediaRule);
  });
  rules.forEach((data, className) => {
    utilitiesLayer.append(generateAtomicRule(className, data));
  });
  return utilitiesLayer;
};

export default createUtilititylayer;
