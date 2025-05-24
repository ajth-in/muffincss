import processMediaRules from "./processors/media";
import type { AtomicRule, AtomizerOptions } from "./types";
import { atRule, Root, type Plugin } from "postcss";
import { generateAtomicRule, generateMediaRules } from "./utils/generate-rules";
import { Instrumentation } from "./core/instrumentation";
import { getResetStyles } from "./resets";
import { generateResolvedClasses } from "./codegen/_resolved/generator";
import { generateCSSModule } from "./codegen/css/generator";
import Options from "./core/options-manager";
import { PostCSSErrorCollector } from "./core/error-handler";
import ResolvedClassListCollector from "./core/resolved-classlist-collector";
import RulesProcessor from "./processors/rules";
const path = require("path");

const instrumentation = new Instrumentation();

const postcssAtomizer = (opts: AtomizerOptions = {}): Plugin => {
  return {
    postcssPlugin: "@muffincss/postcss",
    Once(root: Root, { result }) {
      const errorHandler = new PostCSSErrorCollector(result);
      const { options } = new Options(opts).prepare(errorHandler);
      const resultCollector = new ResolvedClassListCollector();
      instrumentation.start(" Compiled all CSS files");
      const mediaAtRuleMap = new Map<string, Map<string, AtomicRule>>();
      const resolvedClassesMap = new Map<string, string[]>();
      const processorContext = [
        instrumentation,
        errorHandler,
        resultCollector,
        options,
      ] as const;

      const context = {
        processedAtRules: mediaAtRuleMap,
        resolvedClassesMap,
        options,
      } as const;
      root.walkAtRules(processMediaRules(context));
      const { parsedRules } = new RulesProcessor(...processorContext).walk(
        root,
      );

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
        parsedRules.forEach((data, className) => {
          utilitiesLayer.append(generateAtomicRule(className, data));
        });
        node.replaceWith(resetLayer, utilitiesLayer);
        node.remove();
      });
      options.debug && instrumentation.start("write_to_file_system");
      const resolvedOutDirPath = path.join(options.outDir, "_resolved");
      generateResolvedClasses(resolvedClassesMap, resolvedOutDirPath);

      generateCSSModule(path.join(options.outDir, "css"));
      options.debug && instrumentation.end("write_to_file_system");
      options.debug && instrumentation.end(" Compiled all CSS files");
      options.debug && instrumentation.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
