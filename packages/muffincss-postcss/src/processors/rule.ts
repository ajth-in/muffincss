import type { AtRule, Declaration, Rule } from "postcss";
import type { ProcessorContext } from "../types";
import { stringifyDeclaration } from "../utils";

const processRules = (context: ProcessorContext) => (rule: Rule) => {
  const { options, resolvedClassesMap, rulesMap } = context;
  const {
    prefix,
    exclude: { properties },
  } = options;
  if (
    rule.parent?.type === "atrule" &&
    (rule.parent as AtRule).name === "media"
  ) {
    return;
  }
  if (!rule.selector.startsWith(".")) return;
  const atomicClassesForSelector: string[] = [];
  let isRuleRemovable = true;
  rule.walkDecls((declaration: Declaration) => {
    if (properties.some((regex) => regex.test(declaration.prop))) {
      isRuleRemovable = false;
      return;
    }
    const className = stringifyDeclaration(declaration, prefix, options.hash);
    if (!rulesMap.has(className))
      rulesMap.set(className, {
        prop: declaration.prop,
        value: declaration.value,
      });
    atomicClassesForSelector.push(className);
  });

  if (atomicClassesForSelector.length > 0) {
    resolvedClassesMap.set(rule.selector, atomicClassesForSelector);
  }
  if (isRuleRemovable) rule.remove();
};
export default processRules;
