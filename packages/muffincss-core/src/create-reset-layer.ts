import postcss, { atRule } from "postcss/lib/postcss";
import type {
  MuffinConfig,
  ResetLayer,
  ResetRule,
  ResetStyleItem,
} from "./types";
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

export const createResetLayer = (
  level: MuffinConfig["reset"],
  layer: ResetLayer,
) => {
  const resetLayer = atRule({ name: "layer", params: layer });

  const styleRules: ResetStyleItem[] = (() => {
    if (layer === "reset-min") return minimalReset;
    if (layer === "reset-def") return defaultReset;
    return level === "default"
      ? defaultReset
      : level === "minimal"
        ? minimalReset
        : [];
  })();

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
