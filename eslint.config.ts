import eslint from '@eslint/js';
import * as astroParser from 'astro-eslint-parser';
import astro from 'eslint-plugin-astro';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  perfectionist.configs['recommended-natural'],
  unicorn.configs.recommended,
  ...astro.configs['flat/jsx-a11y-recommended'],

  {
    ignores: [
      'dist/*',
      '.tmp/*',
      'static/*',
      'node_modules/*',
      'public/*',
      'src/layouts/Layout.astro',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // ----------------------------------
  // Astro
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        projectService: false,
      },
    },
    rules: {
      'astro/jsx-a11y/media-has-caption': 'off',
      'astro/no-conflict-set-directives': 'off',
    },
  },

  // ----------------------------------
  // JS
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      parserOptions: {
        projectService: false,
      },
    },
  },

  // ----------------------------------
  // Types
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-redeclare': 'off',
    },
  },

  // ----------------------------------
  // Tests
  {
    files: ['**/__test__/**/*.ts', '**/*.{test,spec}.{ts,tsx}'],
    rules: {
      // vitest の mockResolvedValue 等は型上 値引数が必須なため、明示的な undefined を許容する
      'unicorn/no-useless-undefined': ['error', { checkArguments: false }],
    },
  },

  // ----------------------------------
  // ALL files
  {
    rules: {
      // eslint-plugin-unicorn 73 で追加された様式・命名ルールは既存実装の規約と衝突するため無効化する
      'unicorn/consistent-boolean-name': 'off',
      'unicorn/consistent-class-member-order': 'off',
      'unicorn/filename-case': 'off',
      // outDir / isDev などは project.config.ts が公開する既存の命名規約のため置換対象にしない
      'unicorn/name-replacements': 'off',
      'unicorn/no-computed-property-existence-check': 'off',
      'unicorn/no-declarations-before-early-exit': 'off',
      'unicorn/no-non-function-verb-prefix': 'off',
      // globalThis 経由の参照はビルド時（Node 環境）に ReferenceError を避けるため意図的に残す
      'unicorn/no-unnecessary-global-this': 'off',
      'unicorn/prefer-await': 'off',
      'unicorn/prefer-iterator-to-array': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
);
