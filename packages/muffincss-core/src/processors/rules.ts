import { type AtRule, type Declaration, type Root } from "postcss";
import BaseProcessor from "./base";
import type ResolvedClassListCollector from "../core/resolved-classlist-collector";
import type Options from "../core/options-manager";
import type { AtomicRule } from "../types";

export default class RulesProcessor extends BaseProcessor {
  parsedRules: Map<string, AtomicRule>;

  constructor(
    resultCollector: ResolvedClassListCollector,
    options: Options["options"],
  ) {
    super(resultCollector, options);
    this.parsedRules = new Map<string, AtomicRule>();
  }
  private addToParsedRules(className: string, declaration: Declaration) {
    if (!this.parsedRules.has(className))
      this.parsedRules.set(className, {
        prop: declaration.prop,
        value: declaration.value,
      });
  }

  walk(root: Root) {
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
        this.addToParsedRules(atomicClassName, declaration);
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
