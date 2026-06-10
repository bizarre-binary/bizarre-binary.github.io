import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      '*.cjs',
      'node_modules/',
      'dist/',
      'dev-dist/',
      '.astro/',
      'build/',
      '.env',
      '.env.*',
      '!.env.example',
      'pnpm-lock.yaml',
      'yarn.lock',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierRecommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
    },
  }
);
