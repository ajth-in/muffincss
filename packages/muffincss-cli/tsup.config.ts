import { defineConfig } from "tsup";

const sharedOptions = {
  minify: true,
  cjsInterop: true,
  dts: true,
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
