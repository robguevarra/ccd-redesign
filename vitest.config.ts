import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
    },
  },
  test: {
    // Default environment is 'node' for pure-function tests (fast).
    // React component tests use the // @vitest-environment jsdom pragma
    // at the top of each file instead of forcing jsdom globally.
    environment: 'node',
    globals: false,
  },
});
