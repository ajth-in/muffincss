// parsed-rules-manager.ts
import type { Declaration } from "postcss";
import type { AtomicRule } from "../types";

export default class ParsedRulesManager {
  private rulesMap: Map<string, AtomicRule> = new Map();

  add(className: string, declaration: Declaration) {
    if (!this.rulesMap.has(className)) {
      this.rulesMap.set(className, {
        prop: declaration.prop,
        value: declaration.value,
      });
    }
  }

  getAll() {
    return this.rulesMap;
  }
}
