import { Instrumentation } from "@muffincss/core/core/instrumentation";

import { Root, type Plugin } from "postcss";
import { PostCSSErrorCollector } from "@muffincss/core/core/error-handler";
import Options from "@muffincss/core/core/options-manager";
import ResolvedClassListCollector from "@muffincss/core/core/resolved-classlist-collector";
import AtRuleProcessor from "@muffincss/core/processors/at-rules";
import RulesProcessor from "@muffincss/core/processors/rules";
import { createResetLayer } from "@muffincss/core/resets/index";
import createUtilititylayer from "@muffincss/core/core/utility-layer";
import GenerateResolvedClassListModule from "@muffincss/core/codegen/_resolved/generator";
import CssModuleGenerator from "@muffincss/core/codegen/css/generator";

const instrumentation = new Instrumentation();

const postcssAtomizer = (): Plugin => {
  return {
    postcssPlugin: "@muffincss/postcss",
    async Once(root: Root, { result }) {
      const errorHandler = new PostCSSErrorCollector(result);
      const { options } = await new Options(errorHandler).prepare();

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

      new CssModuleGenerator(options).generate();

      new GenerateResolvedClassListModule(resultCollector, options).generate();

      options.debug && instrumentation.end(" Compiled all CSS files");
      options.debug && instrumentation.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
