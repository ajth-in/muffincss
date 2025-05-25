import path from "path";
import type { AtomizerOptions } from "../types";
import fs from "fs";
import type { PostCSSErrorCollector } from "./error-handler";

export const RESOLVED_CLASS_STORE_PATH = "_resolved";
export const CSS_OUTPUT_PATH = "css";

export default class Options {
  options: Required<AtomizerOptions>;

  constructor(options: AtomizerOptions = {}) {
    const merged = Options.merge(options);
    this.options = merged;
  }

  static getDefaults(): Required<AtomizerOptions> {
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

  static merge(options: AtomizerOptions = {}): Required<AtomizerOptions> {
    return {
      ...this.getDefaults(),
      ...options,
    };
  }

  ensureDefaultDirStructure(errorCollector: PostCSSErrorCollector) {
    try {
      const absolutePath = this.getOutputPath();
      fs.mkdirSync(absolutePath, { recursive: true });
      [RESOLVED_CLASS_STORE_PATH, CSS_OUTPUT_PATH].forEach((dir) => {
        fs.mkdirSync(path.join(absolutePath, dir), { recursive: true });
      });
    } catch (err) {
      errorCollector.error("Failed to create the initial directory structure!");
    }
  }

  prepare(errorCollector: PostCSSErrorCollector) {
    this.ensureDefaultDirStructure(errorCollector);
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
