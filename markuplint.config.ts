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
