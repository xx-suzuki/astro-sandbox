import type { AppMode } from '@cli/context';

import { consoleExist, consoleSize } from '@cli/helper/drop-console';
import { isIgnoreFile } from '@cli/helper/utils';
import { staticCopy as config } from '@root/project.config';
import fg from 'fast-glob';
import fs from 'fs-extra';

interface ConfigItem {
  base: string;
  outDir: string;
  useProduction: boolean;
}

/** Functions */
const copyStaticFile = async (file: string, mode: AppMode): Promise<void> => {
  // ----------------------------------
  // ignore
  if (isIgnoreFile(file)) return;

  // ----------------------------------
  // dir
  const changeFolder = file.replace(/\/([^/]*)\/.*$/, '/$1');
  const target = config.find(
    ({ base, useProduction }: ConfigItem) =>
      base === changeFolder && (useProduction || mode === 'development'),
  );

  if (!target) return;

  // ----------------------------------
  // Copy
  const outFile = file.replace(target.base, target.outDir);
  await fs.copy(file, outFile);
  consoleSize(outFile);
};

export const runStaticCopy = async ({
  mode,
  targets,
}: {
  mode: AppMode;
  targets?: string | string[];
}): Promise<void> => {
  const actualTargets = targets || config.map(({ base }: ConfigItem) => `${base}/**`);
  const files = fg.sync(actualTargets);

  if (!targets && files.length === 0) {
    return consoleExist('Static');
  }

  await Promise.all(files.map((f) => copyStaticFile(f, mode)));
};
