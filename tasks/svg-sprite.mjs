import path from 'node:path';
import svgstore from 'svgstore';
import fs from 'fs-extra';
import fg from 'fast-glob';
import { svgSprite as config } from '../project.config.mjs';
import { createFolder } from './helper/utils.mjs';
import { consoleExist, consoleGenerate } from './helper/drop-console.mjs';

const targets = config.files;
const options = {
  cleanSymbols: ['fill', 'stroke', 'stroke-linejoin', 'stroke-width'],
};

/* init */
const sprites = svgstore();
const init = async () => {
  const files = fg.sync(targets);

  if (!fs.existsSync(files[0])) {
    return consoleExist('SVG');
  }

  files.forEach((file) => {
    const { name } = path.parse(file);
    const code = fs.readFileSync(file, { encoding: 'utf-8' });
    sprites.add(name, code, options);
  });
  const svg = sprites
    .toString({ inline: true })
    .replace(
      `<svg>`,
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`,
    );

  createFolder(config.outDir);
  const dist = `${config.outDir}/${config.outName}.svg`;
  fs.writeFileSync(dist, svg);
  consoleGenerate();
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
