import { staticCopy as config, isDev } from '@root/project.config';
import { consoleExist, consoleSize } from '@root/tasks/helper/drop-console';
import { isIgnoreFile } from '@root/tasks/helper/utils';
import fg from 'fast-glob';
import fs from 'fs-extra';

interface ConfigItem {
  base: string;
  outDir: string;
  useProduction: boolean;
}

const targets: string | string[] =
  process.argv[2] || config.map(({ base }: ConfigItem) => `${base}/**`);

/** Functions */
const copyStaticFile = async (file: string): Promise<void> => {
  // ----------------------------------
  // ignore
  if (isIgnoreFile(file)) return;

  // ----------------------------------
  // dir
  const changeFolder = file.replace(/\/([^/]*)\/.*$/, '/$1');
  const target = config.find(
    ({ base, useProduction }: ConfigItem) => base === changeFolder && (useProduction || isDev),
  );

  if (!target) return;

  // ----------------------------------
  // Copy
  const outFile = file.replace(target.base, target.outDir);
  await fs.copy(file, outFile);
  consoleSize(outFile);
};

const init = async (): Promise<void> => {
  const files = fg.sync(targets);

  if (!process.argv[2] && files.length === 0) {
    return consoleExist('Static');
  }

  await Promise.all(files.map((f) => copyStaticFile(f)));
};

/** init */
try {
  await init();
} catch (error) {
  console.trace(error);
  process.exitCode = 1;
}
