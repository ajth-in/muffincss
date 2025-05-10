import processMediaRules from "./processors/media";
import type { AtomicRule, AtomizerOptions } from "./types";
import { Root, type Plugin } from "postcss";
import { generateAtomicRule, generateMediaRules } from "./utils";
import processRules from "./processors/rule";

const postcssAtomizer = (opts: AtomizerOptions = {}): Plugin => {
  const options: Required<AtomizerOptions> = {
    prefix: "a-",
    optimize: true,
    purge: true,
    reset: "default",
    hash: true,
    exclude: { selectors: [], properties: [] },
    ...opts,
  };
  return {
    postcssPlugin: "@muffincss/postcss",
    Once(root: Root) {
      const mediaQueries = new Map<string, Map<string, AtomicRule>>();
      const selectorToAtomicClasses = new Map<string, string[]>();
      const atomicRules = new Map<string, AtomicRule>();

      const context = {
        mediaAtRuleStore: mediaQueries,
        selectorToAtomicClassesStore: selectorToAtomicClasses,
        options,
        atomicRules,
      };
      root.walkAtRules("media", processMediaRules(context));
      root.walkRules(processRules(context));

      mediaQueries.forEach((rules, mediaQuery) => {
        const mediaRule = generateMediaRules(rules, mediaQuery);
        root.append(mediaRule);
      });
      atomicRules.forEach((data, className) => {
        root.append(generateAtomicRule(className, data));
      });

      console.log(selectorToAtomicClasses);
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
