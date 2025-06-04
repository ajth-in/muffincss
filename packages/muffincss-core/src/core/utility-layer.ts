import { atRule } from "postcss";
import { AtRule, Declaration, Rule } from "postcss";
import type { AtomicRule } from "../types";
import type ParsedAtRulesManager from "./parsed-atrules-collector";
import type ParsedRulesManager from "./parsed-rules-manager";

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
  rules: ParsedRulesManager,
  atRules: ParsedAtRulesManager,
) => {
  const utilitiesLayer = atRule({ name: "layer", params: "utilities" });
  atRules.getAll().forEach((rules, mediaQuery) => {
    const mediaRule = generateMediaRules(rules, mediaQuery);
    utilitiesLayer.append(mediaRule);
  });
  rules.getAll().forEach((data, className) => {
    utilitiesLayer.append(generateAtomicRule(className, data));
  });
  return utilitiesLayer;
};

export default createUtilititylayer;
