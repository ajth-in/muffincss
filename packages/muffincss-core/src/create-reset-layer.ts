import postcss, { atRule } from "postcss/lib/postcss";
import type { MuffinConfig, ResetRule, ResetStyleItem } from "./types";
import defaultReset from "./resets/default";
import minimalReset from "./resets/minimal";

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

export const createResetLayer = (level: MuffinConfig["reset"]) => {
  const resetLayer = atRule({ name: "layer", params: "reset" });

  const styleRules: ResetStyleItem[] =
    level === "default"
      ? defaultReset
      : level === "minimal"
        ? minimalReset
        : [];

  styleRules.forEach((entry) => {
    if ("atRule" in entry) {
      const { name, params, rules } = entry.atRule;
      const atRuleNode = postcss.atRule({ name, params });

      (rules as ResetRule[]).forEach(({ selector, declarations }) => {
        const ruleNode = createRuleNode(selector, declarations);
        atRuleNode.append(ruleNode);
      });

      return atRuleNode;
    }
    resetLayer.append(createRuleNode(entry.selector, entry.declarations));
  });
  return resetLayer;
};
