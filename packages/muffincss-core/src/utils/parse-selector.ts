export interface SelectorComponents {
  base: string;
  pseudoClasses: string | null;
  pseudoElement: string | null;
  combinator: {
    type: " " | ">" | "+" | "~";
    selector: SelectorComponents;
  } | null;
}

export const parseSelector = (selector: string): SelectorComponents => {
  const combinatorMatch = selector.match(/(.*?)\s*([>+~ ])\s*(.+)/);

  if (combinatorMatch) {
    const leftSelector = combinatorMatch[1].trim();
    const combinator = combinatorMatch[2] as ">" | "+" | "~" | " ";
    const rightSelector = combinatorMatch[3].trim();
    return {
      ...parseSelector(leftSelector),
      combinator: {
        type: combinator,
        selector: parseSelector(rightSelector),
      },
    };
  }

  const baseMatch = selector.match(/^([^\s:]+)?/);
  const base = baseMatch?.[1] || "";

  const pseudoElementMatch = selector.match(/::[a-zA-Z0-9_-]+/);
  const pseudoElement = pseudoElementMatch?.[0] || null;

  const pseudoClassesMatch = selector.match(/:[^:][^:]*/g)?.join("") || null;

  return {
    base,
    pseudoClasses: pseudoClassesMatch,
    pseudoElement,
    combinator: null,
  };
};

export const addPsedo = (
  className: string,
  parentSelector: SelectorComponents,
) => {
  return `${className}${parentSelector.pseudoClasses ?? ""}${parentSelector.pseudoElement ?? ""}`;
};
