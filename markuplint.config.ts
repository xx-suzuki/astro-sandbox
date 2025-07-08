import type { Config } from '@markuplint/ml-config';

const config: Config = {
  // parser: {
  //   '\\.astro$': '@markuplint/astro-parser',
  // },
  extends: ['markuplint:recommended'],
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
