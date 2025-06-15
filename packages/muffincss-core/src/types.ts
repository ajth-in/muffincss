/**
 * Configuration options for the CSS atomizer.
 */
export type MuffinConfig = {
  /**
   * Directory to store the generated styled system.
   * @default'muffincss'
   */
  outDir?: string;
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
  options: Required<MuffinConfig>;
};

type AtRules = "media" | "container";
export type AtRuleKey = `${AtRules}#${ClassNameKey}`;
export type ClassNameKey = `.${string & {}}`;

export type FileType = "cjs" | "esm" | "dts";

export type FileGenType = { content: string; type: FileType };

export type ResetDeclarations = {
  [property: string]: string | number;
};

export type ResetRule = {
  selector: string;
  declarations: ResetDeclarations;
};

export type ResetAtRule = {
  atRule: {
    name: string;
    params: string;
    rules: ResetStyleItem[];
  };
};

export type ResetStyleItem = ResetRule | ResetAtRule;

/**
 *
 * - `"reset"`: Uses the reset level defined in the root config file .
 * - `"reset-def"`: Forces the use of the **default** CSS reset, regardless of the root config.
 * - `"reset-min"`: Forces the use of the **minimal** CSS reset, regardless of the root config.
 */
export type ResetLayer = "reset" | "reset-def" | "reset-min";
