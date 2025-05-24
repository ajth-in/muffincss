/**
 * Configuration options for the CSS atomizer.
 */
export type AtomizerOptions = {
  /**
   * Directory to store the generated styled system.
   * @default'muffincss'
   */
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
  /**
   * Enables debug mode.
   * for the plugin outputs additional logging and diagnostic
   */
  debug?: boolean;
};

export interface AtomicRule {
  prop: string;
  value: string;
}

export type ProcessorContext = {
  processedAtRules: Map<string, Map<string, AtomicRule>>;
  resolvedClassesMap: Map<string, string[]>;
  options: Required<AtomizerOptions>;
  rulesMap: Map<string, AtomicRule>;
};

type AtRules = "media" | "container";
export type AtRuleKey = `${AtRules}#${ClassNameKey}`;
export type ClassNameKey = `.${string & {}}`;
