import postcss, { atRule } from "postcss/lib/postcss";
import type { AtomizerOptions } from "../types";
import defaultReset from "./default";
import minimalReset from "./minimal";

export type CSSDeclarations = {
  [property: string]: string | number;
};

export type Rule = {
  selector: string;
  declarations: CSSDeclarations;
};

export type AtRule = {
  atRule: {
    name: string;
    params: string;
    rules: StyleRule[];
  };
};

export type StyleRule = Rule | AtRule;

const createRuleNode = (
  selector: string,
  declarations: Record<string, string | number>,
) => {
  const ruleNode = postcss.rule({ selector });
  for (const [prop, value] of Object.entries(declarations)) {
    ruleNode.append(postcss.decl({ prop, value: value.toString() }));
  }
  return ruleNode;
};

export const createResetLayer = (level: AtomizerOptions["reset"]) => {
  const resetLayer = atRule({ name: "layer", params: "reset" });

  const styleRules: StyleRule[] =
    level === "default"
      ? defaultReset
      : level === "minimal"
        ? minimalReset
        : [];

  styleRules.forEach((entry) => {
    if ("atRule" in entry) {
      const { name, params, rules } = entry.atRule;
      const atRuleNode = postcss.atRule({ name, params });

      (rules as Rule[]).forEach(({ selector, declarations }) => {
        const ruleNode = createRuleNode(selector, declarations);
        atRuleNode.append(ruleNode);
      });

      return atRuleNode;
    }
    resetLayer.append(createRuleNode(entry.selector, entry.declarations));
  });
  return resetLayer;
};
