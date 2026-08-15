import type { AppMode } from '@scripts-node/core/context';

import { staticCopy as config } from '@root/project.config';
import { isDirectRun, runCommandCli } from '@scripts-node/core/cli';
import { consoleExist, consoleSize } from '@scripts-node/helper/drop-console';
import { resolveTargets } from '@scripts-node/helper/targets';
import { isIgnoreFile } from '@scripts-node/helper/utils';
import fg from 'fast-glob';
import fs from 'fs-extra';

interface ConfigItem {
  base: string;
  outDir: string;
  useProduction: boolean;
}

// ----------------------------------
// Functions
const copyStaticFile = async (file: string, mode: AppMode): Promise<void> => {
  // ignore
  if (isIgnoreFile(file)) return;

  // dir
  const changeFolder = file.replace(/\/([^/]*)\/.*$/, '/$1');
  const target = config.find(
    /* c8 ignore next */
    ({ base, useProduction }: ConfigItem) =>
      base === changeFolder && (useProduction || mode === 'development'),
  );

  if (!target) return;

  // Copy
  // 置換文字列に `$&` 等が含まれても解釈されないよう関数形式で渡す
  const outFile = file.replace(target.base, () => target.outDir);
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
  const files = targets
    ? resolveTargets(targets)
    : fg.sync(config.map(({ base }: ConfigItem) => `${base}/**`));

  if (!targets && files.length === 0) {
    return consoleExist('Static');
  }

  await Promise.all(files.map((f) => copyStaticFile(f, mode)));
};

if (isDirectRun(import.meta.url)) {
  await runCommandCli({
    moduleUrl: import.meta.url,
    run: async ({ changedFile, mode, targets }) => {
      if (changedFile) return runStaticCopy({ mode, targets: changedFile });
      await runStaticCopy(targets.length > 0 ? { mode, targets } : { mode });
    },
    watch: {
      patterns: ['static'],
      shouldRun: (changedFile) => changedFile.startsWith('static/'),
    },
  });
}
