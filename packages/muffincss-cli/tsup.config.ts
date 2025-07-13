import { defineConfig } from "tsup";
import sharedConfig from "@muffincss/tsup-config";
const sharedOptions = {
  ...sharedConfig,
  external: ["esbuild"],
  entry: ["src/index.ts"],
};

export default defineConfig([
  {
    ...sharedOptions,
    format: ["esm"],
  },
  {
    ...sharedOptions,
    format: ["cjs"],
  },
]);
