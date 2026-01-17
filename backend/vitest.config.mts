import { defineConfig } from 'vitest/config';
import path from 'path';

const config = defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./config.ts', './tests/support/setup.ts'],
    include: ['./tests/**/*.test.ts'],
    isolate: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/types/**', 'src/@types/**'],
    },
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
    },
  },
});

export default config;
