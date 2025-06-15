import type { Root, Rule } from "postcss";

const removeClassOnlyRules = (rule: Rule) => {
  const selectorsWithoutClass = rule.selectors.filter(
    (selector) => !selector.startsWith("."),
  );
  if (selectorsWithoutClass.length === 0) {
    rule.remove();
    return;
  }
  rule.replaceWith(
    rule.clone({
      selector: selectorsWithoutClass.join(","),
    }),
  );
};

export default function cleanupRoot(root: Root) {
  root.walkAtRules("layer", (layerAtRule) => {
    if (layerAtRule.params.trim() !== "muffin") return;
    layerAtRule.walk((node) => {
      if (node.type === "rule") removeClassOnlyRules(node);
      if (node.type === "atrule") {
        node.walkRules((rule) => {
          removeClassOnlyRules(rule);
        });
        if (!node.nodes?.length) node.remove();
      }
    });
    if (!layerAtRule.nodes?.length) layerAtRule.remove();
  });
}
