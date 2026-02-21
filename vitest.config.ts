import tsconfigPaths from 'vite-tsconfig-paths';
/// <reference types="vitest/config" />
// @ts-check
import { defineConfig } from 'vitest/config';

const sharedTestConfig = {
  clearMocks: true,
  coverage: {
    enabled: false,
    provider: 'v8',
  },
  exclude: ['node_modules/**', 'dist/**'],
  globals: true,
  mockReset: true,
  reporters: ['default'],
  restoreMocks: true,
  testTimeout: 30_000,
};

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    projects: [
      {
        extends: true,
        test: {
          ...sharedTestConfig,
          environment: 'node',
          include: ['cli/__test__/**/*.test.ts'],
          name: 'cli',
        },
      },
      {
        extends: true,
        test: {
          ...sharedTestConfig,
          css: true,
          environment: 'jsdom',
          include: ['src/**/*.{test,spec}.{ts,tsx}'],
          name: 'frontend',
          setupFiles: ['src/test/setup.ts'],
        },
      },
    ],
  },
});
