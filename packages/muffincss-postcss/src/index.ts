import { Instrumentation } from "@muffincss/core/core/instrumentation";

import { Root, type Plugin } from "postcss";
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
  const optionsManager = new Options();

  return {
    postcssPlugin: "@muffincss/postcss",
    async Once(root: Root, { result }) {
      const parsedAtRulesManager = new ParsedAtRulesCollector();
      const parsedRulesManager = new ParsedRulesManager();
      const { options } = await optionsManager.prepare();
      const processorContext = [resultCollector, options] as const;
      options.debug && instrumentation.start("Processing source CSS");

      root.walkAtRules("layer", (atRule) => {
        switch (atRule.params.trim()) {
          case "muffin":
            new AtRuleProcessor(...processorContext).walk(
              atRule,
              parsedAtRulesManager,
            );
            new RulesProcessor(...processorContext).walk(
              atRule,
              parsedRulesManager,
            );
            break;
          case "reset":
            const resetLayer = createResetLayer(options.reset);
            if (resetLayer.nodes?.length) {
              atRule.replaceWith(resetLayer);
            }
            break;
        }
      });
      const utilitiesLayer = createUtilititylayer(
        parsedRulesManager,
        parsedAtRulesManager,
      );
      if (utilitiesLayer.nodes?.length) root.prepend(utilitiesLayer);

      options.debug && instrumentation.end("Processing source CSS");
    },
    async OnceExit(root: Root, { result }) {
      const { options } = await optionsManager.prepare();
      options.debug && instrumentation.start("Generating type definitions");
      new CssModuleGenerator(options).generate();
      new GenerateResolvedClassListModule(resultCollector, options).generate();
      options.debug && instrumentation.end("Generating type definitions");
      options.debug && instrumentation.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
