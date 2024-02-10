// https://github.com/plopjs/plop
import { assetsDir, breakpoints, designSize } from './project.config.mjs';

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
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
          assetsDir,
        },
      },
    ],
  });
}
