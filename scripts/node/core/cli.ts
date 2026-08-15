import type { ChokidarOptions } from 'chokidar';

import { applyMode, type AppMode } from '@scripts-node/core/context';
import { startWatch } from '@scripts-node/core/watch';
import { parseCommandCliArgs } from '@scripts-node/helper/cli-args';
import { pathToFileURL } from 'node:url';

export interface CommandCliContext {
  changedFile?: string | undefined;
  mode: AppMode;
  targets: string[];
}

export interface CommandCliOptions {
  allowWatch?: boolean;
  fallbackMode?: AppMode;
  moduleUrl: string;
  run: (context: CommandCliContext) => Promise<void>;
  watch?: {
    patterns: string | string[];
    shouldRun?: (changedFile: string) => boolean;
    watchOptions?: ChokidarOptions;
  };
}

/**
tsx から直接実行されたか（import されただけではないか）を判定する
*/
export const isDirectRun = (moduleUrl: string): boolean => {
  const entry = process.argv[1];
  return typeof entry === 'string' && moduleUrl === pathToFileURL(entry).href;
};

/**
npm scripts から呼ばれるコマンドの起動処理。
直接実行時のみ CLI 引数を解決し、watch 有無に応じて run を実行する。
*/
export const runCommandCli = async ({
  allowWatch = true,
  fallbackMode = 'production',
  moduleUrl,
  run,
  watch,
}: CommandCliOptions): Promise<void> => {
  if (!isDirectRun(moduleUrl)) return;
  try {
    const cliArgs = parseCommandCliArgs(process.argv.slice(2), { allowWatch, fallbackMode });
    const mode = applyMode(cliArgs.mode);

    if (watch && cliArgs.watch) {
      await startWatch({
        initialRun: cliArgs.initialRun,
        patterns: watch.patterns,
        run: async (changedFile) => {
          if (changedFile && watch.shouldRun && !watch.shouldRun(changedFile)) return;
          await run({ changedFile, mode, targets: [] });
        },
        watchOptions: {
          usePolling: true,
          ...watch.watchOptions,
        },
      });
      return;
    }

    await run({ mode, targets: cliArgs.targets });
  } catch (error) {
    console.trace(error);
    process.exitCode = 1;
  }
};
