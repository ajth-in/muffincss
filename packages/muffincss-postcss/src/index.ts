import processMediaRules from "./processors/media";
import type { AtomicRule, AtomizerOptions, ProcessorContext } from "./types";
import { atRule, Root, type Plugin } from "postcss";
import { generateAtomicRule, generateMediaRules } from "./utils/generate-rules";
import processRules from "./processors/rule";
import { Instrumentation } from "./instrumentation";
import { getResetStyles } from "./resets";
import { generateResolvedClasses } from "./codegen/_resolved/generator";
import { generateCSSModule } from "./codegen/css/generator";
import Options from "./util/options-manager";
import { PostCSSErrorCollector } from "./util/error-handler";
const path = require("path");

const I = new Instrumentation();

const postcssAtomizer = (opts: AtomizerOptions = {}): Plugin => {
  return {
    postcssPlugin: "@muffincss/postcss",
    Once(root: Root, { result }) {
      const errorCollector = new PostCSSErrorCollector(result);
      const { options } = new Options(opts).prepare(errorCollector);

      I.start(" Compiled all CSS files");
      const mediaAtRuleMap = new Map<string, Map<string, AtomicRule>>();
      const rulesMap = new Map<string, AtomicRule>();
      const resolvedClassesMap = new Map<string, string[]>();

      const context: ProcessorContext = {
        processedAtRules: mediaAtRuleMap,
        resolvedClassesMap,
        rulesMap,
        options,
      };
      options.debug && I.start("compile_at_rules");
      root.walkAtRules(processMediaRules(context));
      options.debug && I.end("compile_at_rules");
      options.debug && I.start("compile_rules");
      root.walkRules(processRules(context));
      options.debug && I.end("compile_rules");

      root.walkAtRules("muffincss", (node) => {
        const resetLayer = atRule({ name: "layer", params: "reset" });
        const utilitiesLayer = atRule({ name: "layer", params: "utilities" });
        getResetStyles(options.reset).forEach((style) =>
          resetLayer.append(style),
        );
        mediaAtRuleMap.forEach((rules, mediaQuery) => {
          const mediaRule = generateMediaRules(rules, mediaQuery);
          utilitiesLayer.append(mediaRule);
        });
        rulesMap.forEach((data, className) => {
          utilitiesLayer.append(generateAtomicRule(className, data));
        });
        node.replaceWith(resetLayer, utilitiesLayer);
        node.remove();
      });
      options.debug && I.start("write_to_file_system");
      const resolvedOutDirPath = path.join(options.outDir, "_resolved");
      generateResolvedClasses(resolvedClassesMap, resolvedOutDirPath);

      generateCSSModule(path.join(options.outDir, "css"));
      options.debug && I.end("write_to_file_system");
      options.debug && I.end(" Compiled all CSS files");
      options.debug && I.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
