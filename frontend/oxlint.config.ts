import { defineConfig } from 'oxlint';

export default defineConfig({
  ignorePatterns: ['dist'],

  categories: {
    correctness: 'warn',
  },

  rules: {
    'eslint/no-unused-vars': 'warn',
    'eslint/prefer-const': 'warn',
  },
});
