import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import astro from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import unicorn from 'eslint-plugin-unicorn';
import perfectionist from 'eslint-plugin-perfectionist';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  tseslint.configs.stylistic,
  perfectionist.configs['recommended-natural'],
  unicorn.configs.recommended,
  ...astro.configs['flat/jsx-a11y-recommended'],

  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    ignores: [
      'dist/*',
      '.tmp/*',
      'static/*',
      'node_modules/*',
      'public/*',
      'src/layouts/Layout.astro',
    ],
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

  // ----------------------------------
  // ALL files
  {
    rules: {
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
    }
  }
);
