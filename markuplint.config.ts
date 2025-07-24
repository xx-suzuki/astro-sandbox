import type { Config } from '@markuplint/ml-config';

const config: Config = {
  parser: {
    '\\.astro$': '@markuplint/astro-parser',
  },
  parserOptions: {
    ignoreFrontMatter: true,
  },
  extends: ['markuplint:recommended'],
  rules: {
    'invalid-attr': {
      options: {
        allowAttrs: ['prefix'],
      },
    },
  },
  pretenders: [
    {
      selector: 'source',
      as: {
        element: 'source',
        inheritAttrs: true,
      },
    },
  ],
  nodeRules: [
    {
      selector: 'svg',
      rules: {
        'require-accessible-name': false,
      },
    },
  ],
};

export default config;
