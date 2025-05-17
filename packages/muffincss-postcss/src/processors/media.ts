import { type AtRule, type Declaration, type Rule } from "postcss/lib/postcss";
import type { AtomicRule, ProcessorContext } from "../types";
import { stringifyDeclaration } from "../utils";
import { getPseudoClass } from "../utils/psedo-class";

const processMediaRules = (context: ProcessorContext) => (atRule: AtRule) => {
  const { options, mediaAtRuleMap, resolvedClassesMap } = context;
  if (atRule.name !== "media" && atRule.name !== "container") return;
  let isAtRuleRemovable = true;
  const mediaQuery = atRule.params;
  const {
    exclude: { selectors, properties },
    prefix,
  } = options;

  if (selectors.some((regex) => regex.test(mediaQuery))) return;

  if (!mediaAtRuleMap.has(mediaQuery)) {
    mediaAtRuleMap.set(mediaQuery, new Map<string, AtomicRule>());
  }

  atRule.walkRules((rule: Rule) => {
    if (selectors.some((regex) => regex.test(rule.selector))) {
      isAtRuleRemovable = false;
      return;
    }
    if (!rule.selector.startsWith(".")) {
      isAtRuleRemovable = false;
      return;
    }
    const atomicClassesForSelector: string[] = [];
    let isRuleRemovable = true;
    const psedo = getPseudoClass(rule.selector);

    rule.walkDecls((declaration: Declaration) => {
      if (properties.some((regex) => regex.test(declaration.prop))) {
        isRuleRemovable = false;
        return;
      }

      const className = stringifyDeclaration(
        declaration,
        prefix,
        options.hash,
        mediaQuery,
        psedo,
      );
      atomicClassesForSelector.push(className);
      mediaAtRuleMap.get(mediaQuery)!.set(className, {
        prop: declaration.prop,
        value: declaration.value,
      });
    });
    if (isAtRuleRemovable) rule.remove();
    if (atomicClassesForSelector.length > 0) {
      const prevKeys = resolvedClassesMap.get(rule.selector) ?? [];
      resolvedClassesMap.set(rule.selector, [
        ...prevKeys,
        ...atomicClassesForSelector,
      ]);
    }
  });
  if (isAtRuleRemovable) atRule.remove();
};
export default processMediaRules;
