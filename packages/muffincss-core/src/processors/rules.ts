import { type AtRule, type Rule } from "postcss";
import type ResolvedClassListCollector from "../core/resolved-classlist-collector";
import type Options from "../core/options-manager";
import ParsedRulesManager from "../core/parsed-rules-manager";
import {
  addPsedo,
  parseSelector,
  type SelectorComponents,
} from "../core/utils/parse-selector";
import constructUtilityClassName from "../core/utils/construct-utility-name";
import ParsedAtRulesManager from "../core/parsed-atrules-collector";

interface ProcessingContext {
  parentAtRule?: AtRule;
}

export default class RulesProcessor {
  public readonly parsedRulesManager: ParsedRulesManager;
  public readonly parsedAtRulesManager: ParsedAtRulesManager;

  constructor(
    private resultCollector: ResolvedClassListCollector,
    private options: Options["options"],
  ) {
    this.parsedAtRulesManager = new ParsedAtRulesManager();
    this.parsedRulesManager = new ParsedRulesManager();
  }

  public walkNestedAtRules(muffinAtRule: AtRule): this {
    muffinAtRule.walkAtRules((nestedAtRule) => {
      this.parsedAtRulesManager.init(nestedAtRule.params);
      this.processRulesIn(nestedAtRule, { parentAtRule: nestedAtRule });
    });
    return this;
  }

  public processRulesIn(atRule: AtRule, context: ProcessingContext = {}): this {
    atRule.walkRules((rule) => {
      this._processRule(rule, context);
    });
    return this;
  }

  private _processRule(rule: Rule, context: ProcessingContext): void {
    const atomicClassList: string[] = [];

    for (const selector of rule.selectors) {
      if (!selector.startsWith(".")) {
        continue;
      }

      const selectorComponents = parseSelector(selector);
      if (selectorComponents.combinator) {
        // TODO Here you can add logic for handling relational selectors like `>` or `+`.
        continue;
      }

      const generatedClasses = this._processDeclarations(
        rule,
        selectorComponents,
        context,
      );
      atomicClassList.push(...generatedClasses);
      if (atomicClassList.length > 0) {
        this.resultCollector.add(selector, atomicClassList);
      }
    }
  }

  private _processDeclarations(
    rule: Rule,
    selectorComponents: SelectorComponents,
    context: ProcessingContext,
  ): string[] {
    const generatedClasses: string[] = [];

    rule.walkDecls((declaration) => {
      const utilityClassName = constructUtilityClassName(
        declaration,
        selectorComponents,
        this.options,
        context,
      );

      generatedClasses.push(utilityClassName);

      const finalClassName = addPsedo(utilityClassName, selectorComponents);

      if (context.parentAtRule) {
        this.parsedAtRulesManager.add(
          context.parentAtRule.params,
          finalClassName,
          declaration,
        );
      } else {
        this.parsedRulesManager.add(finalClassName, declaration);
      }
    });

    return generatedClasses;
  }
}
