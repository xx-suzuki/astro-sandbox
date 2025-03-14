import jsLint from '@eslint/js';
import astroParser from 'astro-eslint-parser';
import astroLint from 'eslint-plugin-astro';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';
import tsLint from 'typescript-eslint';
// import tsParser from '@typescript-eslint/parser';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  // ----------------------------------
  // Common
  {
    ignores: [
      'dist/*',
      '.tmp/*',
      'static/*',
      'node_modules/*',
      'public/*',
      'src/layouts/Layout.astro',
    ],
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'warn',
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // ----------------------------------
  // Config
  jsLint.configs.recommended,
  ...tsLint.configs.recommended,
  ...tsLint.configs.stylistic,
  ...astroLint.configs['flat/recommended'],

  // ----------------------------------
  // Rules
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-import-type-side-effects': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
    },
  },

  // ----------------------------------
  // Import rules
  {
    plugins: {
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    rules: {
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^astro:.+'],
        },
      ],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '@/**',
              group: 'external',
              position: 'after',
            },
          ],
          'newlines-between': 'never',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  // ----------------------------------
  // Astro
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      'astro/no-conflict-set-directives': 'off',
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
];
