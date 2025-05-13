import processMediaRules from "./processors/media";
import type { AtomicRule, AtomizerOptions, ProcessorContext } from "./types";
import { atRule, Root, type Plugin } from "postcss";
import { generateAtomicRule, generateMediaRules } from "./utils";
import processRules from "./processors/rule";
import { Instrumentation } from "./instrumentation";
import { getResetStyles } from "./resets";
import { ensureOutDirStructure } from "./utils/create-dir-structure";
import generateModuleVersionsWithType from "./generate/maps";
const path = require("path");

const I = new Instrumentation();

const postcssAtomizer = (opts: AtomizerOptions = {}): Plugin => {
  const options: Required<AtomizerOptions> = {
    outDir: "./muffincss",
    prefix: "a-",
    optimize: true,
    purge: true,
    reset: "default",
    hash: true,
    debug: false,
    exclude: { selectors: [], properties: [] },
    ...opts,
  };
  const DEBUG = options.debug || process.env.NODE_ENV === "development";
  return {
    postcssPlugin: "@muffincss/postcss",
    Once(root: Root, { result }) {
      I.start(" Compiled all CSS files");
      const absolutePath = path.resolve(process.cwd(), options.outDir);
      ensureOutDirStructure(absolutePath);

      const mediaAtRuleMap = new Map<string, Map<string, AtomicRule>>();
      const rulesMap = new Map<string, AtomicRule>();
      const resolvedClassesMap = new Map<string, string[]>();

      const context: ProcessorContext = {
        mediaAtRuleMap,
        resolvedClassesMap,
        rulesMap,
        options,
      };
      DEBUG && I.start("compile_at_rules");
      root.walkAtRules("media", processMediaRules(context));
      DEBUG && I.end("compile_at_rules");
      DEBUG && I.start("compile_rules");
      root.walkRules(processRules(context));
      DEBUG && I.end("compile_rules");

      root.walkAtRules("muffincss", (node) => {
        const resetLayer = atRule({ name: "layer", params: "reset" });
        const utilitiesLayer = atRule({ name: "layer", params: "utilities" });
        getResetStyles(options.reset).map((style) => resetLayer.append(style));
        mediaAtRuleMap.forEach((rules, mediaQuery) => {
          const mediaRule = generateMediaRules(rules, mediaQuery);
          utilitiesLayer.append(mediaRule);
        });
        rulesMap.forEach((data, className) => {
          utilitiesLayer.append(generateAtomicRule(className, data));
        });
        node.replaceWith(utilitiesLayer);
        node.remove();
      });

      DEBUG && I.start("write_to_file_system");

      generateModuleVersionsWithType(
        resolvedClassesMap,
        path.join(absolutePath, "__generated"),
      ),
      DEBUG && I.end("write_to_file_system");
      DEBUG && I.end(" Compiled all CSS files");
      DEBUG && I.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
