// import { type Plugin, Root, Rule, AtRule, Declaration, Comment } from "postcss";
// import type { AtomicRule, AtomizerOptions } from "./types";

// /**
//  * PostCSS plugin that converts traditional CSS to atomic CSS
//  * with support for media queries and pseudo-classes
//  */
// const postcssAtomizer = (opts: AtomizerOptions = {}): Plugin => {
//   const options: Required<AtomizerOptions> = {
//     prefix: "a-",
//     optimize: true,
//     purge: true,
//     reset: "default",
//     excludeSelectors: [],
//     excludeProperties: [],
//     pseudoStrategy: "suffix",
//     mediaStrategy: "wrap",
//     ...opts,
//   };

//   const atomicRules = new Map<string, AtomicRule>();
//   const selectorToAtomicClasses = new Map<string, string[]>();
//   const mediaQueries = new Map<string, Map<string, AtomicRule>>();

//   return {
//     postcssPlugin: "@muffincss/postcss",
//     Once(root: Root) {
//       root.walkAtRules("media", (atRule: AtRule) => {
//         const mediaQuery = atRule.params;
//         if (options.excludeSelectors.some((sel) => mediaQuery.includes(sel))) {
//           return;
//         }

//         // Initialize collection for this media query if not exists
//         if (!mediaQueries.has(mediaQuery)) {
//           mediaQueries.set(mediaQuery, new Map<string, AtomicRule>());
//         }

//         // Process rules within this media query
//         atRule.walkRules((rule: Rule) => {
//           // Check if the selector should be excluded
//           if (
//             options.excludeSelectors.some((sel) => rule.selector.includes(sel))
//           ) {
//             return;
//           }

//           // Check if the selector contains a pseudo-class
//           const hasPseudo = /:([a-zA-Z-]+)/.test(rule.selector);
//           let pseudoClass = "";

//           if (hasPseudo) {
//             // Extract the pseudo-class
//             const matches = rule.selector.match(/:([a-zA-Z-]+)/);
//             if (matches && matches[1]) {
//               pseudoClass = matches[1];
//             }
//           }

//           // Extract base selector without pseudo-class
//           const baseSelector = hasPseudo
//             ? rule.selector.replace(/:([a-zA-Z-]+)/, "")
//             : rule.selector;

//           // Process declarations in this rule
//           const atomicClassesForSelector: string[] = [];

//           rule.walkDecls((decl: Declaration) => {
//             // Skip excluded properties
//             if (options.excludeProperties.includes(decl.prop)) {
//               return;
//             }

//             // Create a unique identifier for this property-value pair
//             const mediaQueryId = mediaQuery.replace(/[^a-zA-Z0-9]/g, "_");

//             let propValue = `${decl.prop}-${decl.value.replace(/[^a-zA-Z0-9]/g, "_")}-${mediaQueryId}`;
//             let className = options.prefix + propValue;

//             // Add pseudo-class suffix if using suffix strategy
//             if (hasPseudo && options.pseudoStrategy === "suffix") {
//               propValue += `-${pseudoClass}`;
//               className = options.prefix + propValue;
//             }

//             // Add media query suffix if using suffix strategy
//             if (options.mediaStrategy === "suffix") {
//               // Create sanitized media query string for class name
//               const mediaQueryId = mediaQuery.replace(/[^a-zA-Z0-9]/g, "_");
//               propValue += `-${mediaQueryId}`;
//               className = options.prefix + propValue;
//             }

//             // Store the atomic class for this declaration
//             atomicClassesForSelector.push(className);

//             // Create context object for pseudo-class or media query
//             const context = {
//               type: hasPseudo ? "pseudo" : "media",
//               value: hasPseudo ? pseudoClass : mediaQuery,
//             } as const;

//             // Add to appropriate collection
//             if (options.mediaStrategy === "wrap") {
//               const mediaQueryId = mediaQuery.replace(/[^a-zA-Z0-9]/g, "_");

//               // For wrap strategy, store in media queries map
//               mediaQueries.get(mediaQuery)!.set(className, {
//                 prop: decl.prop,
//                 value: decl.value,
//                 context: hasPseudo
//                   ? { type: "pseudo", value: pseudoClass }
//                   : undefined,
//               });
//             } else {
//               // For suffix strategy, store in main atomic rules
//               atomicRules.set(className, {
//                 prop: decl.prop,
//                 value: decl.value,
//                 context,
//               });
//             }
//           });

//           // Store mapping for this selector within media query
//           if (atomicClassesForSelector.length > 0) {
//             const mappingKey = `${mediaQuery} | ${rule.selector}`;
//             selectorToAtomicClasses.set(mappingKey, atomicClassesForSelector);
//           }
//         });
//       });

//       // Process top-level rules (outside media queries)
//       root.walkRules((rule: Rule) => {
//         // Skip rules within media queries (already processed)
//         if (
//           rule.parent?.type === "atrule" &&
//           (rule.parent as AtRule).name === "media"
//         ) {
//           return;
//         }

//         // Check if the selector should be excluded
//         if (
//           options.excludeSelectors.some((sel) => rule.selector.includes(sel))
//         ) {
//           return;
//         }

//         // Check if the selector contains a pseudo-class
//         const hasPseudo = /:([a-zA-Z-]+)/.test(rule.selector);
//         let pseudoClass = "";

//         if (hasPseudo) {
//           // Extract the pseudo-class
//           const matches = rule.selector.match(/:([a-zA-Z-]+)/);
//           if (matches && matches[1]) {
//             pseudoClass = matches[1];
//           }
//         }

//         // Extract base selector without pseudo-class
//         const baseSelector = hasPseudo
//           ? rule.selector.replace(/:([a-zA-Z-]+)/, "")
//           : rule.selector;

//         // Process declarations in this rule
//         const atomicClassesForSelector: string[] = [];

//         rule.walkDecls((decl: Declaration) => {
//           // Skip excluded properties
//           if (options.excludeProperties.includes(decl.prop)) {
//             return;
//           }

//           // Create a unique identifier for this property-value pair
//           let propValue = `${decl.prop}-${decl.value.replace(/[^a-zA-Z0-9]/g, "_")}`;
//           let className = options.prefix + propValue;

//           // Add pseudo-class suffix if present and using suffix strategy
//           if (hasPseudo && options.pseudoStrategy === "suffix") {
//             propValue += `-${pseudoClass}`;
//             className = options.prefix + propValue;
//           }

//           // Store the atomic class for this declaration
//           atomicClassesForSelector.push(className);

//           // Add to our map of atomic rules if we haven't seen this one before
//           if (!atomicRules.has(className)) {
//             atomicRules.set(className, {
//               prop: decl.prop,
//               value: decl.value,
//               context: hasPseudo
//                 ? { type: "pseudo", value: pseudoClass }
//                 : undefined,
//             });
//           }
//         });

//         // Store the mapping from original selector to atomic classes
//         if (atomicClassesForSelector.length > 0) {
//           selectorToAtomicClasses.set(rule.selector, atomicClassesForSelector);
//         }
//       });

//       // Store the original CSS for reference
//       const originalCss = root.toString();

//       // Clear original CSS
//       root.removeAll();

//       // Generate a reference stylesheet with all atomic classes

//       // First, add normal atomic classes (without pseudo-classes or with suffix strategy)
//       atomicRules.forEach((data, className) => {
//         // Create the rule with appropriate selector
//         let selector = `.${className}`;

//         // If using separate strategy for pseudo-classes, add the pseudo-class to the selector
//         if (
//           data.context?.type === "pseudo" &&
//           options.pseudoStrategy === "separate"
//         ) {
//           selector = `.${className.replace(`-${data.context.value}`, "")}:${data.context.value}`;
//         }

//         const newRule = new Rule({ selector });
//         newRule.append(new Declaration({ prop: data.prop, value: data.value }));
//         root.append(newRule);
//       });

//       // For wrap strategy, add media queries and their rules
//       if (options.mediaStrategy === "wrap") {
//         mediaQueries.forEach((rules, mediaQuery) => {
//           const mediaRule = new AtRule({ name: "media", params: mediaQuery });

//           rules.forEach((data, className) => {
//             // Create appropriate selector based on pseudo strategy
//             let selector = `.${className}`;

//             if (data.context?.type === "pseudo") {
//               if (options.pseudoStrategy === "separate") {
//                 selector = `.${className}:${data.context.value}`;
//               }
//             }

//             const newRule = new Rule({ selector });
//             newRule.append(
//               new Declaration({ prop: data.prop, value: data.value }),
//             );
//             mediaRule.append(newRule);
//           });

//           root.append(mediaRule);
//         });
//       }

//       // Generate a mapping file to show which original selectors map to which atomic classes
//       let mappingComment = "Atomic CSS Mapping:\n";
//       selectorToAtomicClasses.forEach((atomicClasses, selector) => {
//         mappingComment += `${selector} => ${atomicClasses.join(" ")}\n`;
//       });

//       root.prepend(new Comment({ text: mappingComment }));

//       // Add original CSS as a comment for reference
//       root.prepend(new Comment({ text: `Original CSS:\n${originalCss}` }));
//     },
//   };
// };

// postcssAtomizer.postcss = true;

// export default postcssAtomizer;
