import type { AtRule, Declaration, Rule } from "postcss";
import type { ProcessorContext } from "../types";
import { stringifyDeclaration } from "../utils";

const processRules = (context: ProcessorContext) => (rule: Rule) => {
  const { options, resolvedClassesMap, rulesMap } = context;
  const {
    prefix,
    exclude: { properties },
  } = options;
  if (
    rule.parent?.type === "atrule" &&
    (rule.parent as AtRule).name === "media"
  ) {
    return;
  }
  if (!rule.selector.startsWith(".")) return;
  const atomicClassesForSelector: string[] = [];
  let isRuleRemovable = true;
  const psedo = getPseudoClass(rule.selector);

  rule.walkDecls((declaration: Declaration) => {
    if (properties.some((regex) => regex.test(declaration.prop))) {
      isRuleRemovable = false;
      return;
    }

    const className = stringifyDeclaration(
      declaration,
      prefix,
      options.hash,
      undefined,
      psedo,
    );
    if (!rulesMap.has(className))
      rulesMap.set(className, {
        prop: declaration.prop,
        value: declaration.value,
      });
    atomicClassesForSelector.push(className);
  });

  if (atomicClassesForSelector.length > 0) {
    const selector = psedo ? removePseudoClasses(rule.selector) : rule.selector;
    if (resolvedClassesMap.has(selector)) {
      resolvedClassesMap.get(selector)!.push(...atomicClassesForSelector);
    } else {
      resolvedClassesMap.set(selector, atomicClassesForSelector);
    }
  }
  if (isRuleRemovable) rule.remove();
};

function getPseudoClass(selector: string): string | undefined {
  const index = selector.indexOf(":");
  if (index === -1) return;
  return selector.slice(index + 1);
}
function removePseudoClasses(selector: string): string {
  return selector.replace(/:{1,2}[a-zA-Z0-9_-]+/g, "");
}
export default processRules;
