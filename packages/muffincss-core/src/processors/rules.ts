import { type AtRule, type Declaration, type Root } from "postcss";
import BaseProcessor from "./base";
import type ResolvedClassListCollector from "../core/resolved-classlist-collector";
import type Options from "../core/options-manager";
import type ParsedRulesManager from "../core/parsed-rules-manager";

export default class RulesProcessor extends BaseProcessor {
  constructor(
    resultCollector: ResolvedClassListCollector,
    options: Options["options"],
  ) {
    super(resultCollector, options);
  }

  walk(root: Root, parsedRulesManager: ParsedRulesManager) {
    root.walkRules((rule) => {
      const atomicClassList: string[] = [];
      let isRuleRemovable = true;

      const isClassSelector = rule.selector.startsWith(".");
      const isParentHandled =
        rule.parent?.type === "atrule" &&
        this.isAtRuleHandled(rule.parent as AtRule);
      if (isParentHandled || !isClassSelector || this.isExcludedSelector(rule))
        return;
      const pseudoClass = BaseProcessor.getPseudoClass(rule.selector);

      rule.walkDecls((declaration: Declaration) => {
        const atomicClassName = this.constructAtomicClassName(declaration, {
          pseudoClass,
        });
        parsedRulesManager.add(atomicClassName, declaration);
        atomicClassList.push(
          BaseProcessor.removePseudoClasses(atomicClassName),
        );
      });
      if (atomicClassList.length > 0) {
        const selector = pseudoClass
          ? BaseProcessor.removePseudoClasses(rule.selector)
          : rule.selector;
        this.resultCollector.add(selector, atomicClassList);
      }
      if (isRuleRemovable) rule.remove();
    });
    return this;
  }
}
