import { Declaration, Rule, type AtRule, type Root } from "postcss";
import type ResolvedClassListCollector from "../core/resolved-classlist-collector";
import type Options from "../core/options-manager";
import { x86 } from "murmurhash3js";

export default abstract class BaseProcessor {
  private handledAtRules: string[] = ["media", "container", "pattern", "cv"];
  constructor(
    protected resultCollector: ResolvedClassListCollector,
    protected options: Options["options"],
  ) {}
  isAtRuleHandled(atRule: AtRule) {
    return this.handledAtRules.includes(atRule.name);
  }
  isExcludedDeclaration(declaration: Declaration) {
    return this.options.exclude.properties.some((regex) =>
      regex.test(declaration.prop),
    );
  }
  isExcludedSelector(rule: Rule) {
    return this.options.exclude.selectors.some((regex) =>
      regex.test(rule.selector),
    );
  }
  static formatToId = (input: string) => input.replace(/[^a-zA-Z0-9]/g, "_");

  constructAtomicClassName(
    decl: Declaration,
    options: {
      atRuleParam?: string;
      pseudoClass?: string;
    } = {},
  ): string {
    const { atRuleParam: atruleParam, pseudoClass } = options;
    const declarationId = `${decl.prop}-${BaseProcessor.formatToId(decl.value)}`;
    const out = atruleParam
      ? `${declarationId}-${BaseProcessor.formatToId(atruleParam)}`
      : declarationId;

    const result = this.options.hash
      ? `${this.options.prefix}${x86.hash32(out).toString(16)}`
      : `${this.options.prefix}${out}`;

    if (pseudoClass) {
      return `${result}-${BaseProcessor.formatToId(pseudoClass)}:${pseudoClass}`;
    }

    return result;
  }
  static getPseudoClass(selector: string): string | undefined {
    const index = selector.indexOf(":");
    if (index === -1) return;
    return selector.slice(index + 1);
  }
  static removePseudoClasses(selector: string): string {
    return selector.replace(/:{1,2}[a-zA-Z0-9_-]+/g, "");
  }

  abstract walk(root: Root): void;
}
