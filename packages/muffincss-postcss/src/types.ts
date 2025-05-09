export type PluginOptions = {
  /**
   * If true, compiles all CSS styles into atomic utility classes.
   */
  optimize?: boolean;

  /**
   * If true, removes all unused CSS styles during the build process.
   */
  purge?: boolean;

  /**
   * Specifies the CSS reset strategy to apply.
   * - "minimal": Applies a minimal reset.
   * - "default": Applies the default reset (default value).
   * - "off": Disables CSS reset entirely.
   */
  reset?: "minimal" | "default" | "off";
};
