export default class ResolvedClassListCollector {
  private resolvedClassesMap = new Map<string, string[]>();
  constructor() {}
  add(key: string, classNames: string[]): void {
    if (!this.resolvedClassesMap.has(key)) {
      this.resolvedClassesMap.set(key, []);
    }
    this.resolvedClassesMap.get(key)!.push(...classNames);
  }
  serialize(): Record<string, string[]> {
    const obj: Record<string, string[]> = {};
    for (const [key, value] of this.resolvedClassesMap.entries()) {
      obj[key] = Array.from(new Set(value));
    }
    return obj;
  }
}
