import processMediaRules from "./processors/media";
import type { AtomicRule, AtomizerOptions, ProcessorContext } from "./types";
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

const I = new Instrumentation();

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
      I.start(" Compiled all CSS files");

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

      const mediaAtRuleMap = new Map<string, Map<string, AtomicRule>>();
      const rulesMap = new Map<string, AtomicRule>();
      const resolvedClassesMap = new Map<string, string[]>();

      const context: ProcessorContext = {
        mediaAtRuleMap,
        resolvedClassesMap,
        rulesMap,
        options,
      };
      I.start("compile_at_rules");
      root.walkAtRules("media", processMediaRules(context));
      I.end("compile_at_rules");
      I.start("compile_rules");
      root.walkRules(processRules(context));
      I.end("compile_rules");
      mediaAtRuleMap.forEach((rules, mediaQuery) => {
        const mediaRule = generateMediaRules(rules, mediaQuery);
        root.append(mediaRule);
      });
      rulesMap.forEach((data, className) => {
        root.append(generateAtomicRule(className, data));
      });
      I.start("write_to_file_system");
      generateTemplates(
        `${absolutePath}/__generated`,
        Object.fromEntries(resolvedClassesMap),
      );
      I.end("write_to_file_system");
      I.end(" Compiled all CSS files");
      I.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
