import type { Declaration, Root } from "postcss";
import BaseProcessor from "./base";
import type ResolvedClassListCollector from "../core/resolved-classlist-collector";
import type Options from "../core/options-manager";
import type { AtomicRule } from "../types";

export default class AtRuleProcessor extends BaseProcessor {
  parsedAtRules: Map<string, Map<string, AtomicRule>>;

  constructor(
    resultCollector: ResolvedClassListCollector,
    options: Options["options"],
  ) {
    super(resultCollector, options);
    this.parsedAtRules = new Map<string, Map<string, AtomicRule>>();
  }
  initParsedAtRules(atRuleParams: string) {
    if (!this.parsedAtRules.has(atRuleParams)) {
      this.parsedAtRules.set(atRuleParams, new Map<string, AtomicRule>());
    }
  }
  addToParsedAtRules(
    atRuleParams: string,
    className: string,
    declaration: Declaration,
  ) {
    this.parsedAtRules.get(atRuleParams)!.set(className, declaration);
  }
  walk(root: Root) {
    root.walkAtRules((atRule) => {
      let isAtRuleRemovable = true;
      if (!this.isAtRuleHandled(atRule)) {
        return;
      }
      const atRuleParam = atRule.params;
      this.initParsedAtRules(atRuleParam);
      atRule.walkRules((rule) => {
        let isRuleRemovable = true;
        const atomicClassList: string[] = [];

        const isClassSelector = rule.selector.startsWith(".");

        if (this.isExcludedSelector(rule) || !isClassSelector) {
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
          this.addToParsedAtRules(atRuleParam, atomicClassName, declaration);
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
