import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
    reporters: ['verbose'],
    outputFile: {
      json: './__tests__/results.json',
      html: './__tests__/results.html',
    },
  },
});
