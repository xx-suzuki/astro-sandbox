import type { AppMode } from '@scripts-node/core/context';

import { applyMode } from '@scripts-node/core/context';
import { startWatch } from '@scripts-node/core/watch';
import { parseCommandCliArgs } from '@scripts-node/helper/cli-args';
import { consoleExist, consoleSize } from '@scripts-node/helper/drop-console';
import { isIgnoreFile } from '@scripts-node/helper/utils';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { pathToFileURL } from 'node:url';

interface ConfigItem {
  base: string;
  outDir: string;
  useProduction: boolean;
}

// ----------------------------------
// Config
const config: ConfigItem[] = [
  {
    base: 'static/assets',
    outDir: '.tmp/assets',
    useProduction: true,
  },
  {
    base: 'static/root',
    outDir: '.tmp',
    useProduction: true,
  },
];

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
  const files = (() => {
    if (!targets) return fg.sync(config.map(({ base }: ConfigItem) => `${base}/**`));

    const targetList = Array.isArray(targets) ? targets : [targets];
    const resolved = targetList.flatMap((target) => {
      if (fs.existsSync(target)) return [target];
      return fg.sync(target);
    });

    return [...new Set(resolved)];
  })();

  if (!targets && files.length === 0) {
    return consoleExist('Static');
  }

  await Promise.all(files.map((f) => copyStaticFile(f, mode)));
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
    const mode = applyMode(cliArgs.mode);

    await (cliArgs.watch
      ? startWatch({
          initialRun: cliArgs.initialRun,
          patterns: ['static'],
          run: async (changedFile) => {
            if (changedFile && !changedFile.startsWith('static/')) return;
            await runStaticCopy(changedFile ? { mode, targets: changedFile } : { mode });
          },
          watchOptions: {
            usePolling: true,
          },
        })
      : runStaticCopy(cliArgs.targets.length > 0 ? { mode, targets: cliArgs.targets } : { mode }));
  } catch (error) {
    console.trace(error);
    process.exitCode = 1;
  }
}
/* c8 ignore end */
