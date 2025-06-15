import { type AtRule, type Rule } from "postcss";
import ParsedRulesManager from "./state/parsed-rules-manager";
import ParsedAtRulesManager from "./state/parsed-atrules-manager";
import type ResolvedClassListCollector from "./state/resolved-classlist-collector";
import type Options from "./options-manager";
import {
  addPsedo,
  parseSelector,
  type SelectorComponents,
} from "./utils/parse-selector";
import constructUtilityClassName from "./utils/construct-utility-name";

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
    for (const selector of rule.selectors) {
      // todo: Same operation is repeated for multiple selector
      if (!selector.startsWith(".")) {
        continue;
      }
      const atomicClassList: string[] = [];

      const selectorComponents = parseSelector(selector);
      if (selectorComponents.combinator) {
        // TODO handle relational selectors like `>` or `+`.
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
