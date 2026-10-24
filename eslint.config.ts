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
    files: ['**/__tests__/**/*.ts', '**/*.{test,spec}.{ts,tsx}'],
    rules: {
      // vitest の mockResolvedValue 等は型上 値引数が必須なため、明示的な undefined を許容する
      'unicorn/no-useless-undefined': ['error', { checkArguments: false }],
    },
  },

  // ----------------------------------
  // ALL files
  {
    rules: {
      // クラスメンバー順は unicorn/consistent-class-member-order が担当。両者は要求する並びが逆で共存できない
      'perfectionist/sort-classes': 'off',
      // TypeScript / SCSS は kebab-case。`__tests__` は Vitest の慣例ディレクトリ名のため対象外
      'unicorn/filename-case': ['error', { case: 'kebabCase', ignore: [/^__tests__$/] }],
      // src / ext / arg などは Astro の props 名や既存 API の一部のため置換対象にしない
      'unicorn/name-replacements': 'off',
      // astro.config.ts の loadEnv() など、設定ファイルはトップレベル実行が前提
      'unicorn/no-top-level-side-effects': 'off',
      // globalThis 経由の参照はビルド時（Node 環境）に ReferenceError を避けるため意図的に残す
      'unicorn/no-unnecessary-global-this': 'off',
      // core/watch.ts の queue は .then() チェーン自体が実行の直列化を担う
      'unicorn/prefer-await': 'off',
      // Iterator#toArray() は対応ブラウザが限られるためスプレッド展開を維持する
      'unicorn/prefer-iterator-to-array': 'off',
      // ブラウザ向けバンドルでトップレベル await は出力チャンクの形式に影響する
      'unicorn/prefer-top-level-await': 'off',
    },
  },

  // ----------------------------------
  // Astro filename（ALL files の kebabCase を上書きするため最後に置く）
  // src/pages はファイル名がそのままルートになるため kebabCase 側に残す
  {
    files: ['src/components/**/*.astro', 'src/layouts/**/*.astro'],
    rules: {
      // ディレクトリ名は ALL files の kebabCase 側で検査するためここでは対象外にする
      'unicorn/filename-case': ['error', { case: 'pascalCase', checkDirectories: false }],
    },
  },
);
