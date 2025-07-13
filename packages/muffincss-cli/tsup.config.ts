import { defineConfig } from "tsup";

const sharedOptions = {
  minify: true,
  cjsInterop: true,
  dts: true,
  entry: ["src/index.ts"],
  external: ["esbuild"],
    noExternal: ['@muffincss/core'],

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
