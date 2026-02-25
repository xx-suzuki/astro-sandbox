import type { Config } from 'svg-sprite';
import type { CustomPlugin, Config as SVGOConfig } from 'svgo';

import { applyMode } from '@scripts-node/core/context';
import { startWatch } from '@scripts-node/core/watch';
import { parseCommandCliArgs } from '@scripts-node/helper/cli-args';
import { consoleExist, consoleGenerate } from '@scripts-node/helper/drop-console';
import { createFolder } from '@scripts-node/helper/utils';
import fg from 'fast-glob';
import fs from 'fs-extra';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import svgSprite from 'svg-sprite';
import { optimize } from 'svgo';

// ----------------------------------
// Config
const config = {
  files: 'src/assets/svg-sprite/*.svg',
  outDir: '.tmp/assets/images',
  outName: 'sprite',
};

const svgFilePattern = /\.svg$/i;

const removeSymbolXmlns: CustomPlugin = {
  fn: () => {
    return {
      element: {
        enter: (node) => {
          if (node.name === 'symbol' && node.attributes.xmlns) {
            delete node.attributes.xmlns;
          }
        },
      },
    };
  },
  name: 'removeSymbolXmlns',
};

const svgoConfig: SVGOConfig = {
  js2svg: {
    pretty: false,
  },
  multipass: true,
  plugins: [
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill|stroke|stroke-linejoin|stroke-width)',
      },
    },
    {
      name: 'removeComments',
    },
    {
      name: 'removeMetadata',
    },
    {
      name: 'removeTitle',
    },
    removeSymbolXmlns,
  ],
};

const options: Config = {
  mode: {
    symbol: {
      dest: config.outDir,
      sprite: `${config.outName}.svg`,
    },
  },
  svg: {
    transform: [
      (svg) => {
        const { data } = optimize(String(svg), svgoConfig);
        return data;
      },
    ],
    xmlDeclaration: false,
  },
};

// ----------------------------------
// Functions
const encodeSVG = (svg: string) => {
  return svg.replaceAll(/<\?xml.*?\?>\s*/g, '');
};

export const runSvgSprite = async (targets?: string | string[]): Promise<void> => {
  const files = fg.sync(targets || config.files);
  const rootPath = process.cwd();
  const scssPath = path.join(rootPath, 'src/styles/setting/variable', '_svg.scss');
  const spriter = new svgSprite(options);
  await fs.writeFile(scssPath, '', 'utf8');

  if (files.length === 0) {
    return consoleExist('SVG');
  }

  const types: string[] = [];
  const svgSources: Record<string, string> = {};
  for (const file of files) {
    const name = path.parse(file).name.replaceAll(/\s+/g, '-');
    const code = fs.readFileSync(file, { encoding: 'utf8' });
    svgSources[name] = optimize(code, svgoConfig).data;
    spriter.add(name, '', code);
    types.push(name);
  }

  // for svg-sprite
  const { result } = await spriter.compileAsync();
  for (const mode in result) {
    for (const resource in result[mode]) {
      fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
      fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
    }
  }

  // for types
  const typesPath = path.join(rootPath, 'src/types', 'svg-sprite.ts');
  const unionType = types.map((name) => `'${name}'`).join(' | ');
  const tsContent = `// prettier-ignore\nexport type SvgSpriteNames = ${unionType};\n`;
  createFolder(path.join(rootPath, 'src/types'));
  await fs.writeFile(typesPath, tsContent, 'utf8');

  // for scss
  const scssContent = Object.entries(svgSources)
    .map(([name, svg]) => {
      const encodedSVG = encodeSVG(svg);
      return `$${name}: url('data:image/svg+xml;charset=UTF-8,${encodedSVG}');`;
    })
    .join('\n');
  await fs.writeFile(scssPath, scssContent, 'utf8');

  consoleGenerate();
};

/* c8 ignore start */
const isDirectRun =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    const cliArgs = parseCommandCliArgs(process.argv.slice(2), {
      allowWatch: true,
      fallbackMode: 'production',
    });
    applyMode(cliArgs.mode);

    await (cliArgs.watch
      ? startWatch({
          initialRun: cliArgs.initialRun,
          patterns: ['src/assets/svg-sprite'],
          run: async (changedFile) => {
            if (changedFile && !svgFilePattern.test(changedFile)) return;
            await runSvgSprite();
          },
          watchOptions: {
            usePolling: true,
          },
        })
      : runSvgSprite(cliArgs.targets.length > 0 ? cliArgs.targets : undefined));
  } catch (error) {
    console.trace(error);
    process.exitCode = 1;
  }
}
/* c8 ignore end */
