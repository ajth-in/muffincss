import { readFileSync } from "fs";
import { transformSync } from "esbuild";

const loaders = {
  ".js": async (filepath: string) => {
    delete require.cache[filepath];
    const config = require(filepath);
    return config.default || config;
  },

  ".ts": async (filepath: string) => {
    try {
      const tsCode = readFileSync(filepath, "utf8");
      const result = transformSync(tsCode, {
        loader: "ts",
        format: "cjs",
        target: "node14",
      });

      const Module = require("module");
      const tempModule = new Module(filepath, module);
      tempModule.filename = filepath;
      tempModule._compile(result.code, filepath);

      return tempModule.exports.default || tempModule.exports;
    } catch (error) {
      throw new Error(
        `Cannot load TypeScript config file ${filepath}. Please install esbuild: npm install esbuild`,
      );
    }
  },
  ".mjs": async (filepath: string) => {
    try {
      const config = await import(`${filepath}?t=${Date.now()}`);
      return config.default || config;
    } catch (error) {
      throw new Error(
        `Cannot load ES module config file ${filepath}: ${error}`,
      );
    }
  },

  ".cjs": async (filepath: string) => {
    delete require.cache[filepath];
    const config = require(filepath);
    return config.default || config;
  },

  ".json": async (filepath: string) => {
    delete require.cache[filepath];
    const config = require(filepath);
    return config;
  },
};

export default loaders;
