import { type AtRule, type Declaration, type Rule } from "postcss/lib/postcss";
import type { AtomicRule, AtomizerOptions } from "../types";
import { stringifyDeclaration } from "../utils";

const processMediaRules =
  (
    store: Map<string, Map<string, AtomicRule>>,
    selectorToAtomicClassesStore: Map<string, string[]>,

    options: Required<AtomizerOptions>,
  ) =>
  (atRule: AtRule) => {
    let isAtRuleRemovable = true;
    const mediaQuery = atRule.params;
    const {
      exclude: { selectors, properties },
      prefix,
    } = options;

    if (selectors.some((regex) => regex.test(mediaQuery))) return;

    if (!store.has(mediaQuery)) {
      store.set(mediaQuery, new Map<string, AtomicRule>());
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
      rule.walkDecls((declaration: Declaration) => {
        if (properties.some((regex) => regex.test(declaration.prop))) {
          isRuleRemovable = false;
          return;
        }

        const className = stringifyDeclaration(declaration, prefix, mediaQuery);
        atomicClassesForSelector.push(className);
        store.get(mediaQuery)!.set(className, {
          prop: declaration.prop,
          value: declaration.value,
        });
      });
      if (isAtRuleRemovable) rule.remove();
      if (atomicClassesForSelector.length > 0) {
        const mappingKey = `${mediaQuery} | ${rule.selector}`;
        selectorToAtomicClassesStore.set(mappingKey, atomicClassesForSelector);
      }
    });
    if (isAtRuleRemovable) atRule.remove();
  };
export default processMediaRules;
