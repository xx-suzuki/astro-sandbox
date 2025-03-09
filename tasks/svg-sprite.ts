import path from 'node:path';
import svgSprite from 'svg-sprite';
import type { Config } from 'svg-sprite';
import { optimize } from 'svgo';
import type { CustomPlugin, Config as SVGOConfig } from 'svgo';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { svgSprite as config } from '@root/project.config';
import { consoleExist, consoleGenerate } from '@root/tasks/helper/drop-console';
import { createFolder } from '@root/tasks/helper/utils';

const removeSymbolXmlns: CustomPlugin = {
  name: 'removeSymbolXmlns',
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
};

const svgoConfig: SVGOConfig = {
  plugins: [
    {
      name: 'removeAttrs',
      params: {
        attrs: '(fill|stroke|stroke-linejoin|stroke-width)',
      },
    },
    removeSymbolXmlns,
  ],
};

const options: Config = {
  mode: {
    // CSSでも使用する時
    // stack: {
    //   dest: config.outDir,
    //   sprite: `${config.outName}.svg`,
    // },
    symbol: {
      dest: config.outDir,
      sprite: `${config.outName}.svg`,
    },
  },
  svg: {
    xmlDeclaration: false,
    transform: [
      (svg) => {
        const { data } = optimize(String(svg), svgoConfig);
        return data;
      },
    ],
  },
};

const encodeSVG = (svg: string) => {
  return svg
    .replace(/<\?xml.*?\?>\s*/g, '')
    .replace(/\n/g, '')
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/{/g, '%7B')
    .replace(/}/g, '%7D');
};

/* init */
const spriter = new svgSprite(options);

const init = async (): Promise<void> => {
  const files = fg.sync(config.files);

  if (files.length === 0) {
    return consoleExist('SVG');
  }

  const types: string[] = [];
  const svgSources: Record<string, string> = {};
  files.forEach((file) => {
    const name = path.parse(file).name.replace(/\s+/g, '-');
    const code = fs.readFileSync(file, { encoding: 'utf-8' });
    svgSources[name] = code;
    spriter.add(name, null, code);
    types.push(name);
  });

  // for svg-sprite
  const { result } = await spriter.compileAsync();
  for (const mode in result) {
    for (const resource in result[mode]) {
      fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
      fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
    }
  }

  // for types
  const rootPath = process.cwd();
  const typesPath = path.join(rootPath, 'src/types', 'svg-sprite.ts');
  const unionType = types.map((name) => `'${name}'`).join(' | ');
  const tsContent = `// prettier-ignore\nexport type SvgSpriteNames = ${unionType};\n`;
  createFolder(path.join(rootPath, 'src/types'));
  await fs.writeFile(typesPath, tsContent, 'utf-8');

  // for scss
  const scssContent = Object.entries(svgSources).map(([name, svg]) => {
    const encodedSVG = encodeSVG(svg);
    return `$${name}: url('data:image/svg+xml;charset=UTF-8,${encodedSVG}');`;
  }).join('\n');
  const scssPath = path.join(rootPath, 'src/styles/setting/variable', '_svg.scss');
  await fs.writeFile(scssPath, scssContent, 'utf-8');


  consoleGenerate();
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
