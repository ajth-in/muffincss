/**
 * Configuration options for the CSS atomizer.
 */
export type AtomizerOptions = {
  outDir?: string;
  /**
   * If true, compiles all CSS styles into atomic utility classes.
   * @default true
   */
  optimize?: boolean;

  /**
   * If true, removes all unused CSS styles during the build process.
   * @default true
   */
  purge?: boolean;

  /**
   * Specifies the CSS reset strategy to apply.
   * - "minimal": Applies a minimal reset.
   * - "default": Applies the default reset.
   * - "off": Disables CSS reset entirely.
   * @default "default"
   */
  reset?: "minimal" | "default" | "off";

  /**
   * Prefix to apply to all generated utility class names.
   * @default "a-"
   */
  prefix?: string;

  /**
   * List of CSS selectors and properties to exclude from processing.
   */
  exclude?: {
    selectors: RegExp[];
    properties: RegExp[];
  };
  /**
   * Whether to hash all class names.
   * Defaults to true.
   */
  hash?: boolean;
};

export interface AtomicRule {
  prop: string;
  value: string;
}

export type ProcessorContext = {
  mediaAtRuleStore: Map<string, Map<string, AtomicRule>>;
  selectorToAtomicClassesStore: Map<string, string[]>;
  options: Required<AtomizerOptions>;
  atomicRules: Map<string, AtomicRule>;
};
