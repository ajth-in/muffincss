import { defineConfig } from 'tsup';

const sharedOptions = {
  minify: true,
  cjsInterop: true,
  dts: true,
  external: [],
  noExternal: ['@muffincss/core'],
};
const sharedEntries = ['src/tools/index.ts', 'src/types.ts'];

export default defineConfig([
  {
    ...sharedOptions,
    format: ['esm'],

    entry: ['src/index.ts', ...sharedEntries],
  },
  {
    ...sharedOptions,
    format: ['cjs'],
    entry: ['src/index.cts', ...sharedEntries],
  },
]);
