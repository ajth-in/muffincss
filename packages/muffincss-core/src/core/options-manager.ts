import path from "path";
import type { MuffinConfig } from "../types";
import type { PostCSSErrorCollector } from "./error-handler";
import { lilconfig } from "lilconfig";
import loaders from "./utils/options-loader";

export const RESOLVED_CLASS_STORE_PATH = "_resolved";
export const CSS_OUTPUT_PATH = "css";

export default class Options {
  options: Required<MuffinConfig>;
  private possibleConfigFiles = [
    "muffin.config.js",
    "muffin.config.ts",
    "muffin.config.mjs",
    "muffin.config.cjs",
    "muffin.config.json",
  ];
  constructor(private errorCollector?: PostCSSErrorCollector) {
    this.options = Options.getDefaults();
  }

  static getDefaults(): Required<MuffinConfig> {
    return {
      outDir: "./muffincss",
      prefix: "a-",
      optimize: true,
      purge: true,
      reset: "default",
      hash: true,
      debug: false,
      exclude: { selectors: [] },
    };
  }

  async merge() {
    const options = await this.getContent();
    this.options = {
      ...Options.getDefaults(),
      ...options,
    } as Required<MuffinConfig>;

    return this;
  }

  async getConfigFile(startDir?: string): Promise<string | null> {
    const searchDir = startDir || process.cwd();

    const explorer = lilconfig("muffin", {
      searchPlaces: this.possibleConfigFiles,
      loaders,
      stopDir: path.resolve(searchDir, ".."),
    });

    try {
      const result = await explorer.search(searchDir);

      return result ? result.filepath : null;
    } catch (error) {
      this.errorCollector?.error("Error finding muffin config");
      return null;
    }
  }

  async getContent(startDir?: string): Promise<Required<MuffinConfig> | null> {
    const configPath = await this.getConfigFile(startDir);
    if (!configPath) {
      return null;
    }

    const searchDir = startDir || process.cwd();
    const explorer = lilconfig("muffin", {
      searchPlaces: this.possibleConfigFiles,
      loaders,
    });

    try {
      const result = await explorer.search(searchDir);

      if (!result) {
        return null;
      }

      const { config } = result;

      if (!config || typeof config !== "object") {
        throw new Error(
          `Invalid config file: Expected an object, got ${typeof config}`,
        );
      }

      return config as Required<MuffinConfig>;
    } catch (error) {
      this.errorCollector?.error("Error loading config content:");
      return null;
    }
  }



  async prepare() {
    await this.merge();
    this.options.debug =
      this.options.debug === true ||
      process.env.NODE_ENV === "development" ||
      process.env.DEBUG === "true" ||
      process.env.DEBUG === "1";
    return this;
  }

  getOutputPath(): string {
    return path.resolve(process.cwd(), this.options.outDir);
  }
}
