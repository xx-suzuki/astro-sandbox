// https://github.com/plopjs/plop
import type { NodePlopAPI } from 'plop';

import { assetsDir, baseDir, breakpoints, designSize } from '@root/project.config';

export default function config(plop: NodePlopAPI) {
  // ----------------------------------
  // Scss auto-generate
  plop.setGenerator('scss', {
    actions: [
      {
        data: {
          breakpoints,
          designSize,
        },
        force: true,
        path: `src/styles/setting/variable/_breakpoint.scss`,
        templateFile: 'plop/styles/_breakpoint.scss.hbs',
        type: 'add',
      },
      {
        data: {
          assetsDir,
          baseDir,
        },
        force: true,
        path: `src/styles/setting/variable/_path.scss`,
        templateFile: 'plop/styles/_path.scss.hbs',
        type: 'add',
      },
    ],
    description: '',
    prompts: [],
  });

  // ----------------------------------
  // Components
  plop.setGenerator('comp', {
    actions: [
      {
        path: 'src/components/{{titleCase slug}}.astro',
        templateFile: 'plop/astro/components/index.astro.hbs',
        type: 'add',
      },
    ],
    description: 'Astro components template generate',
    prompts: [
      {
        message: 'src/components/{path please}',
        name: 'slug',
        type: 'input',
      },
    ],
  });

  // ----------------------------------
  // project
  plop.setGenerator('pro', {
    actions: [
      {
        path: 'src/projects/{{titleCase slug}}.astro',
        templateFile: 'plop/astro/projects/index.astro.hbs',
        type: 'add',
      },
    ],
    description: 'Astro projects template generate',
    prompts: [
      {
        message: 'src/projects/{path please}',
        name: 'slug',
        type: 'input',
      },
    ],
  });
}
