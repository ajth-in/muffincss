import path from "path";
import type { AtomizerOptions } from "../types";
import fs from "fs";

export const RESOLVED_CLASS_STORE_PATH = "_resolved";
export const CSS_OUTPUT_PATH = "css";

export default class OptionsManager {
  options: Required<AtomizerOptions>;

  constructor(options: AtomizerOptions = {}) {
    const merged = OptionsManager.merge(options);
    this.options = merged;
    this.prepare();
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
      exclude: { selectors: [], properties: [] },
    };
  }

  static merge(options: AtomizerOptions = {}): Required<AtomizerOptions> {
    return {
      ...this.getDefaults(),
      ...options,
    };
  }

  static ensureDefaultDirStructure(absolutePath: string) {
    try {
      fs.mkdirSync(absolutePath, { recursive: true });
      [RESOLVED_CLASS_STORE_PATH, CSS_OUTPUT_PATH].forEach((dir) => {
        fs.mkdirSync(path.join(absolutePath, dir), { recursive: true });
      });
    } catch (err) {
      console.error("Failed to create the initial directory structure!", err);
    }
  }

  prepare(): void {
    const absolutePath = this.getOutputPath();
    OptionsManager.ensureDefaultDirStructure(absolutePath);
  }

  getOutputPath(): string {
    return path.resolve(process.cwd(), this.options.outDir);
  }
}
