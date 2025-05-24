import type {
  AtomicRule,
  AtomizerOptions,
  ATRULE_KEY,
  CLASS_NAME_KEY,
  ProcessorContext,
} from "../types";

export default class CSSProcessor {
  private context: ProcessorContext;

  constructor(private options: Required<AtomizerOptions>) {
    this.context = this.initializeContext();
  }
  private initializeContext(): ProcessorContext {
    return {
      processedAtRules: new Map<ATRULE_KEY, Map<string, AtomicRule>>(),
      rulesMap: new Map<string, AtomicRule>(),
      resolvedClassesMap: new Map<CLASS_NAME_KEY, string[]>(),
      options: this.options,
    };
  }
}
