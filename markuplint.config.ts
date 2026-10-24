import type { Config } from '@markuplint/ml-config';

const config: Config = {
  extends: ['markuplint:recommended'],
  nodeRules: [
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
    // Astro は任意の要素を自己終了形で書けるが、markuplint 5 はこれを未閉鎖と判定するため無効化する
    'html-standard/no-unclosed-element-at-eof': false,
    // invalid-attr は v6 で削除予定のため後継ルールへ移行済み
    'no-unknown-attr': {
      options: {
        allowAttrs: ['prefix'],
      },
    },
    // markuplint 5 で recommended に入った非規範ルール。head の並びは Layout.astro で手動管理する
    'performance/head-element-order': false,
  },
};

export default config;
