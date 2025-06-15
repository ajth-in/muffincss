import { Instrumentation } from "@muffincss/core/core/instrumentation";
import { Root, type Plugin } from "postcss";

import Options from "@muffincss/core/core/options-manager";
import ResolvedClassListCollector from "@muffincss/core/core/resolved-classlist-collector";
import RulesProcessor from "@muffincss/core/processors/rules";
import { createResetLayer } from "@muffincss/core/resets/index";
import createUtilityLayer from "@muffincss/core/core/utility-layer";

import GenerateResolvedClassListModule from "@muffincss/core/codegen/_resolved/generator";
import CssModuleGenerator from "@muffincss/core/codegen/css/generator";
import cleanupRoot from "@muffincss/core/core/utils/cleanup-root";

const instrumentation = new Instrumentation();

const postcssAtomizer = (): Plugin => {
  const resultCollector = new ResolvedClassListCollector();
  const optionsManager = new Options();

  return {
    postcssPlugin: "@muffincss/postcss",

    async Once(root: Root, { result }) {
      const { options } = await optionsManager.prepare();
      const context = [resultCollector, options] as const;
      const rulesProcessor = new RulesProcessor(...context);

      if (options.debug) instrumentation.start("Processing source CSS");

      root.walkAtRules("layer", (layerAtRule) => {
        const layer = layerAtRule.params.trim();

        if (layer === "muffin") {
          rulesProcessor
            .walkNestedAtRules(layerAtRule)
            .processRulesIn(layerAtRule);
          return;
        }

        if (layer === "reset") {
          const resetLayer = createResetLayer(options.reset);
          if (resetLayer.nodes?.length) {
            layerAtRule.replaceWith(resetLayer);
          }
        }
      });

      const utilitiesLayer = createUtilityLayer(
        rulesProcessor.parsedRulesManager,
        rulesProcessor.parsedAtRulesManager,
      );

      if (utilitiesLayer.nodes?.length) {
        root.prepend(utilitiesLayer);
      }

      if (options.debug) instrumentation.end("Processing source CSS");
    },

    async OnceExit(root: Root, { result }) {
      const { options } = await optionsManager.prepare();
      if (options.debug) instrumentation.start("Generating type definitions");
      new CssModuleGenerator(options).generate();
      new GenerateResolvedClassListModule(resultCollector, options).generate();
      if (options.debug) instrumentation.end("Generating type definitions");
      cleanupRoot(root);
      if (options.debug) instrumentation.report();
    },
  };
};

postcssAtomizer.postcss = true;

export default postcssAtomizer;
