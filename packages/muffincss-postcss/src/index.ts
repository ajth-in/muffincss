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
import { Instrumentation } from "./instrumentation";
const path = require("path");
const fs = require("fs");
const { performance } = require("perf_hooks");

const instrumentation = new Instrumentation();

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
      instrumentation.start(" Compiled all CSS files");

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
      instrumentation.start("Compiled all at-rules");
      root.walkAtRules("media", processMediaRules(context));
      instrumentation.end("Compiled all at-rules");
      instrumentation.start("Compiled all rules");
      root.walkRules(processRules(context));
      instrumentation.end("Compiled all rules");
      mediaQueries.forEach((rules, mediaQuery) => {
        const mediaRule = generateMediaRules(rules, mediaQuery);
        root.append(mediaRule);
      });
      atomicRules.forEach((data, className) => {
        root.append(generateAtomicRule(className, data));
      });
      instrumentation.start("Writing to file system");
      generateTemplates(
        `${absolutePath}/__generated`,
        Object.fromEntries(selectorToAtomicClasses),
      );
      instrumentation.end("Writing to file system");
      instrumentation.end(" Compiled all CSS files");
      instrumentation.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
