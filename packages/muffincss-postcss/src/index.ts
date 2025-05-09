import { atRule, type AcceptedPlugin } from "postcss";
import type Declaration_ from "postcss/lib/declaration";
import { getResetStyles } from "./resets";
import type { PluginOptions } from "./types";
import { getCompressedUniqueHash } from "./hash";

export default function muffincss(opts: PluginOptions): AcceptedPlugin {
  const { optimize, purge, reset = "default" } = opts;
  return {
    postcssPlugin: "@muffincss/postcss",

    async Root(root, { result }) {
      const demandedStyles: Array<{ selector: string; decl: Declaration_ }> =
        [];
      const demandedAtRules: Array<{
        media: string;
        selector: string;
        declaration: Declaration_;
      }> = [];

      root.walkAtRules("media", (atRule) => {
        const mediaDescription = atRule.params;
        let haveNonClassRules = false;
        atRule.walkRules((rule) => {
          if (!rule.selector.startsWith(".")) {
            haveNonClassRules = true;
            return;
          }

          rule.walkDecls((decl) => {
            demandedAtRules.push({
              media: mediaDescription,
              selector: rule.selector,
              declaration: decl,
            });
          });
          rule.remove();
        });
        if (!haveNonClassRules) atRule.remove();
      });

      const newAtRules = demandedAtRules.map(
        ({ selector, declaration, media }) => {
          const newAtRule = atRule({ params: selector, name: media });
          const selectorHash = getCompressedUniqueHash(declaration.value);

          newAtRule
            .append({ selector: `.${selectorHash}` })
            .append({ prop: declaration.prop, value: declaration.value });
          return newAtRule;
        },
      );
      root.walkAtRules("muffincss", (node) => {
        // resetting the styles
        const resetLayer = atRule({ name: "layer", params: "reset" });
        getResetStyles().map((style) => resetLayer.append(style));
        // node.replaceWith();
        node.remove();
      });
    },
  };
}
