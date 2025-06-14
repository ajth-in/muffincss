import type { AtRule } from "postcss";
import BaseProcessor from "./base";
import type ResolvedClassListCollector from "../core/resolved-classlist-collector";
import type Options from "../core/options-manager";
import type ParsedAtRulesManager from "../core/parsed-atrules-collector";

export default class AtRuleProcessor extends BaseProcessor {
  constructor(
    resultCollector: ResolvedClassListCollector,
    options: Options["options"],
  ) {
    super(resultCollector, options);
  }

  walk(root: AtRule, parsedAtRulesManager: ParsedAtRulesManager) {
    root.walkAtRules((atRule) => {
      let isAtRuleRemovable = true;
      if (!this.isAtRuleHandled(atRule)) {
        return;
      }
      const atRuleParam = atRule.params;
      parsedAtRulesManager.init(atRuleParam);
      atRule.walkRules((rule) => {
        let isRuleRemovable = true;
        const atomicClassList: string[] = [];

        const isClassSelector = rule.selector.startsWith(".");

        if (!isClassSelector) {
          isAtRuleRemovable = false;
          return;
        }
        const pseudoClass = BaseProcessor.getPseudoClass(rule.selector);
        rule.walkDecls((declaration) => {
          const atomicClassName = this.constructAtomicClassName(declaration, {
            pseudoClass,
            atRuleParam,
          });
          atomicClassList.push(
            BaseProcessor.removePseudoClasses(atomicClassName),
          );
          parsedAtRulesManager.add(atRuleParam, atomicClassName, declaration);
        });
        if (isRuleRemovable) rule.remove();
        if (atomicClassList.length > 0) {
          const selector = pseudoClass
            ? BaseProcessor.removePseudoClasses(rule.selector)
            : rule.selector;
          this.resultCollector.add(selector, atomicClassList);
        }
      });
      if (isAtRuleRemovable) atRule.remove();
    });
    return this;
  }
}
