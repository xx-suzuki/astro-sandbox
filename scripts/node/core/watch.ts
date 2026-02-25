import type { ChokidarOptions } from 'chokidar';

import chokidar from 'chokidar';

export const normalizeWatchPatterns = (value: string | string[]): string[] => {
  return Array.isArray(value) ? value : [value];
};

export const startWatch = async ({
  initialRun,
  patterns,
  run,
  watchOptions,
}: {
  initialRun: boolean;
  patterns: string | string[];
  run: (changedFile?: string) => Promise<void>;
  watchOptions?: ChokidarOptions;
}): Promise<void> => {
  let queue = Promise.resolve();
  const enqueue = (file?: string) => {
    queue = queue
      /* c8 ignore start */
      .catch((error) => {
        void error;
      })
      /* c8 ignore end */
      .then(() => run(file))
      .catch((error) => {
        console.trace(error);
        process.exitCode = 1;
      });
  };

  if (initialRun) {
    enqueue();
  }

  const watcher = chokidar.watch(normalizeWatchPatterns(patterns), {
    awaitWriteFinish: {
      pollInterval: 50,
      stabilityThreshold: 200,
    },
    ignoreInitial: true,
    ...watchOptions,
  });

  watcher
    .on('add', (filePath) => enqueue(filePath))
    .on('change', (filePath) => enqueue(filePath))
    .on('error', (error) => {
      console.trace(error);
      process.exitCode = 1;
    });

  await new Promise<void>((resolve) => {
    const close = async () => {
      await watcher.close();
      resolve();
    };

    process.once('SIGINT', close);
    process.once('SIGTERM', close);
  });
};
