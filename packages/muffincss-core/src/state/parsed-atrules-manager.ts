import type { Declaration } from "postcss";
import type { AtomicRule } from "../types";

export default class ParsedAtRulesManager {
  private rulesMap: Map<string, Map<string, AtomicRule>> = new Map();

  init(atRuleParams: string) {
    if (!this.rulesMap.has(atRuleParams)) {
      this.rulesMap.set(atRuleParams, new Map<string, AtomicRule>());
    }
  }

  add(atRuleParams: string, className: string, declaration: Declaration) {
    this.rulesMap.get(atRuleParams)!.set(className, declaration.clone());
  }

  getAll() {
    return this.rulesMap;
  }
}
