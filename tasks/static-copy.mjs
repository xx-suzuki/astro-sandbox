import fg from 'fast-glob';
import fs from 'fs-extra';
import { isDev, staticCopy as config } from '../project.config.mjs';
import { consoleSize, consoleExist } from './helper/drop-console.mjs';
import { isIgnoreFile } from './helper/utils.mjs';

const targets = process.argv[2] || config.map(({ base }) => `${base}/**`);

/** Functions */
const copyStaticFile = async (file) => {
  // ----------------------------------
  // ignore
  if (isIgnoreFile(file)) return;

  // ----------------------------------
  // dir
  const changeFolder = file.replace(/\/([^/]*)\/.*$/, '/$1');
  const target = config.find(
    ({ base, useProduction }) => base === changeFolder && (useProduction || isDev),
  );
  if (!target) return;

  // ----------------------------------
  // Copy
  const outFile = file.replace(target.base, target.outDir);
  await fs.copy(file, outFile, {
    recursive: true,
  });
  consoleSize(outFile);
};

const init = async () => {
  const files = fg.sync(targets);

  if (!process.argv[2] && !fs.existsSync(files[0])) {
    return consoleExist('Static');
  }

  await Promise.all(files.map(copyStaticFile));
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
