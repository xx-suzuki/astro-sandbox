// https://github.com/plopjs/plop
import { baseDir, assetsDir, breakpoints, designSize } from './project.config.mjs';

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  // ----------------------------------
  // Scss auto-generate
  plop.setGenerator('scss', {
    description: '',
    prompts: [],
    actions: [
      {
        type: 'add',
        path: `src/styles/setting/variable/_width.scss`,
        templateFile: 'plop/styles/_width.scss.hbs',
        force: true,
        data: {
          breakpoints,
          designSize,
        },
      },
      {
        type: 'add',
        path: `src/styles/setting/variable/_path.scss`,
        templateFile: 'plop/styles/_path.scss.hbs',
        force: true,
        data: {
          baseDir,
          assetsDir,
        },
      },
    ],
  });

  // ----------------------------------
  // Components
  plop.setGenerator('comp', {
    description: 'Astro components template generate',
    prompts: [
      {
        type: 'input',
        name: 'slug',
        message: 'src/components/{path please}',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{titleCase slug}}.astro',
        templateFile: 'plop/astro/components/index.astro.hbs',
      },
    ],
  });

  // ----------------------------------
  // project
  plop.setGenerator('pro', {
    description: 'Astro projects template generate',
    prompts: [
      {
        type: 'input',
        name: 'slug',
        message: 'src/projects/{path please}',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/projects/{{titleCase slug}}.astro',
        templateFile: 'plop/astro/projects/index.astro.hbs',
      },
    ],
  });
}
