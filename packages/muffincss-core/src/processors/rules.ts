import { type AtRule } from "postcss";
import BaseProcessor from "./base";
import type ResolvedClassListCollector from "../core/resolved-classlist-collector";
import type Options from "../core/options-manager";
import type ParsedRulesManager from "../core/parsed-rules-manager";
import { addPsedo, parseSelector } from "../core/utils/parse-selector";
import constructUtilityClassName from "../core/utils/construct-utility-name";
import type ParsedAtRulesManager from "../core/parsed-atrules-collector";

export default class RulesProcessor extends BaseProcessor {
  constructor(
    resultCollector: ResolvedClassListCollector,
    options: Options["options"],
  ) {
    super(resultCollector, options);
  }
  walkAtRules(
    muffinAtRule: AtRule,
    parsedRulesManager: ParsedRulesManager,
    parsedAtRulesManager: ParsedAtRulesManager,
  ) {
    muffinAtRule.walkAtRules((atRule) => {
      parsedAtRulesManager.init(atRule.params);
      this.walk(atRule, parsedRulesManager, parsedAtRulesManager, true);
    });
    return this;
  }
  walk(
    muffinAtRule: AtRule,
    parsedRulesManager: ParsedRulesManager,
    parsedAtRulesManager: ParsedAtRulesManager,
    isParent?: boolean,
  ) {
    muffinAtRule.walkRules((rule) => {
      const { selectors } = rule;
      selectors.forEach((selector) => {
        const atomicClassList: string[] = [];

        if (selector.startsWith(".")) {
          const selectorComponents = parseSelector(selector);
          if (selectorComponents.combinator) {
            // handle relational selector
          } else {
            rule.walkDecls((declaration) => {
              const utilityClassName = constructUtilityClassName(
                declaration,
                selectorComponents,
                this.options,
                isParent ? { parentAtRule: muffinAtRule } : {},
              );
              if (isParent) {
                parsedAtRulesManager.add(
                  muffinAtRule.params,
                  addPsedo(utilityClassName, selectorComponents),
                  declaration,
                );
              } else
                parsedRulesManager.add(
                  addPsedo(utilityClassName, selectorComponents),
                  declaration,
                );
              atomicClassList.push(utilityClassName);
            });
            if (atomicClassList.length > 0)
              this.resultCollector.add(selector, atomicClassList);
          }
        } else {
          // target contains non class selector
        }
      });
    });

    return this;
  }
}
