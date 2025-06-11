import { Instrumentation } from "@muffincss/core/core/instrumentation";

import { Root, type Plugin } from "postcss";
import { PostCSSErrorCollector } from "@muffincss/core/core/error-handler";
import Options from "@muffincss/core/core/options-manager";
import ResolvedClassListCollector from "@muffincss/core/core/resolved-classlist-collector";
import AtRuleProcessor from "@muffincss/core/processors/at-rules";
import RulesProcessor from "@muffincss/core/processors/rules";
import { createResetLayer } from "@muffincss/core/resets/index";
import createUtilititylayer from "@muffincss/core/core/utility-layer";
import ParsedAtRulesCollector from "@muffincss/core/core/parsed-atrules-collector";

import GenerateResolvedClassListModule from "@muffincss/core/codegen/_resolved/generator";
import CssModuleGenerator from "@muffincss/core/codegen/css/generator";
import ParsedRulesManager from "@muffincss/core/core/parsed-rules-manager";

const instrumentation = new Instrumentation();

const postcssAtomizer = (): Plugin => {
  const resultCollector = new ResolvedClassListCollector();

  return {
    postcssPlugin: "@muffincss/postcss",
    async Once(root: Root, { result }) {
      const parsedAtRulesManager = new ParsedAtRulesCollector();
      const parsedRulesManager = new ParsedRulesManager();
      const errorHandler = new PostCSSErrorCollector(result);
      const { options } = await new Options(errorHandler).prepare();

      instrumentation.start(" Compiled all CSS files");
      const processorContext = [resultCollector, options] as const;
      new AtRuleProcessor(...processorContext).walk(root, parsedAtRulesManager);
      new RulesProcessor(...processorContext).walk(root, parsedRulesManager);

      const resetLayer = createResetLayer(options.reset);
      const utilitiesLayer = createUtilititylayer(
        parsedRulesManager,
        parsedAtRulesManager,
      );
      root.prepend(resetLayer, utilitiesLayer);

      new CssModuleGenerator(options).generate();
      new GenerateResolvedClassListModule(resultCollector, options).generate();

      options.debug && instrumentation.end(" Compiled all CSS files");
      options.debug && instrumentation.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
