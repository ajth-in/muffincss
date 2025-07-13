import { defineConfig } from 'tsup';
import sharedConfig from '@muffincss/tsup-config';

const sharedEntries = ['src/tools/index.ts', 'src/types.ts'];

export default defineConfig([
  {
    ...sharedConfig,
    format: ['esm'],
    entry: ['src/index.ts', ...sharedEntries],
  },
  {
    ...sharedConfig,
    format: ['cjs'],
    entry: ['src/index.cts', ...sharedEntries],
  },
]);
