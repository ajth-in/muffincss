import type {
  AtomicRule,
  AtomizerOptions,
  AtRuleKey,
  ClassNameKey,
  ProcessorContext,
} from "../types";

export default class CSSProcessor {
  private context: ProcessorContext;

  constructor(private options: Required<AtomizerOptions>) {
    this.context = this.initializeContext();
  }
  private initializeContext(): ProcessorContext {
    return {
      processedAtRules: new Map<AtRuleKey, Map<string, AtomicRule>>(),
      rulesMap: new Map<string, AtomicRule>(),
      resolvedClassesMap: new Map<ClassNameKey, string[]>(),
      options: this.options,
    };
  }
}
