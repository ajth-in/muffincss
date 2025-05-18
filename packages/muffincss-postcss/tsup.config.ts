import { defineConfig } from "tsup";

const sharedOptions = {
  minify: true,
  cjsInterop: true,
  dts: true,
};

export default defineConfig([
  {
    ...sharedOptions,
    format: ["esm"],
    entry: ["src/index.ts", "src/tools/index.ts"],
  },
  {
    ...sharedOptions,
    format: ["cjs"],
    entry: ["src/index.cts", "src/tools/index.ts"],
  },
]);
