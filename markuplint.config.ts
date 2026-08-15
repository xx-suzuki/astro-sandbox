import type { Config } from '@markuplint/ml-config';

const config: Config = {
  extends: ['markuplint:recommended'],
  nodeRules: [
    {
      rules: {
        'require-accessible-name': false,
      },
      selector: 'svg',
    },
    // BudouX が出力するテキストは静的解析で追えないため、名前解決の対象から外す
    {
      rules: {
        'require-accessible-name': false,
      },
      selector: ':has(> .u-budoux)',
    },
  ],
  parser: {
    '\\.astro$': '@markuplint/astro-parser',
  },
  parserOptions: {
    ignoreFrontMatter: true,
  },
  pretenders: [
    {
      as: {
        element: 'source',
        inheritAttrs: true,
      },
      selector: 'source',
    },
    // astro:assets の Font は link / style を出力する
    {
      as: {
        attrs: [{ name: 'rel', value: 'preload' }],
        element: 'link',
      },
      selector: 'Font',
    },
    // BudouX は分かち書き済みテキストを持つ span を出力する
    {
      as: {
        attrs: [{ name: 'class', value: 'u-budoux' }],
        element: 'span',
      },
      selector: 'BudouX',
    },
  ],
  rules: {
    'invalid-attr': {
      options: {
        allowAttrs: ['prefix'],
      },
    },
  },
};

export default config;
