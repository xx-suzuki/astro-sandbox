import path from 'node:path';
import svgSprite from 'svg-sprite';
import type { Config } from 'svg-sprite';
import { optimize } from 'svgo';
import type { CustomPlugin, Config as SVGOConfig } from 'svgo';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { svgSprite as config } from '../project.config.mjs';
import { consoleExist, consoleGenerate } from './helper/drop-console';

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

/* init */
const spriter = new svgSprite(options);

const init = async (): Promise<void> => {
  const files = fg.sync(config.files);

  if (files.length === 0 || !fs.existsSync(files[0])) {
    return consoleExist('SVG');
  }

  files.forEach((file) => {
    const { name } = path.parse(file);
    const code = fs.readFileSync(file, { encoding: 'utf-8' });
    spriter.add(name, null, code);
  });

  const { result } = await spriter.compileAsync();
  for (const mode in result) {
    for (const resource in result[mode]) {
      fs.mkdirSync(path.dirname(result[mode][resource].path), { recursive: true });
      fs.writeFileSync(result[mode][resource].path, result[mode][resource].contents);
    }
  }
  consoleGenerate();
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
