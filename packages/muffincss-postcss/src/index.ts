import type { AtomizerOptions } from "./types";
import { Root, type Plugin } from "postcss";
import { Instrumentation } from "./instrumentation";
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
      const processorContext = [resultCollector, options] as const;
      const { parsedAtRules } = new AtRuleProcessor(...processorContext).walk(
        root,
      );
      const { parsedRules } = new RulesProcessor(...processorContext).walk(
        root,
      );
      root.walkAtRules("muffincss", (node) => {
        const resetLayer = createResetLayer(options.reset);
        const utilitiesLayer = createUtilititylayer(parsedRules, parsedAtRules);
        node.replaceWith(resetLayer, utilitiesLayer);
        node.remove();
      });

      new GenerateResolvedClassListModule(resultCollector, options).generate();
      new CssModuleGenerator(options).generate();

      options.debug && instrumentation.end(" Compiled all CSS files");
      options.debug && instrumentation.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
