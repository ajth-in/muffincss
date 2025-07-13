import { defineConfig } from "tsup";
import sharedConfig from "@muffincss/tsup-config";

const sharedOptions = {
  ...sharedConfig,
  entry: ["src/**/*.ts"],
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
