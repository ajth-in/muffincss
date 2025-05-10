import processMediaRules from "./processors/media";
import type { AtomicRule, AtomizerOptions } from "./types";
import { Root, type Plugin } from "postcss";
import {
  generateAtomicRule,
  generateMediaRules,
  generateTemplates,
} from "./utils";
import processRules from "./processors/rule";
import message from "./lib/chalk";
const path = require("path");
const fs = require("fs");

const postcssAtomizer = (opts: AtomizerOptions = {}): Plugin => {
  const options: Required<AtomizerOptions> = {
    outDir: "./muffincss",
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
    Once(root: Root, { result }) {
      const absolutePath = path.resolve(process.cwd(), options.outDir);
      if (!fs.existsSync(absolutePath)) {
        result.warn(
          message(
            "success",
            `The directory ${options.outDir} is missing. Run '@muffincss/cli init' to set up.`,
          ),
        );
        return;
      }

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

      generateTemplates(
        `${absolutePath}/__generated`,
        Object.fromEntries(selectorToAtomicClasses),
      );
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
