import type { AppMode } from '@cli/context';

import { runImageMin } from '@cli/commands/image-min';
import { runStaticCopy } from '@cli/commands/static-copy';
import { runSvgSprite } from '@cli/commands/svg-sprite';
import { consoleDone } from '@cli/helper/drop-console';
import chokidar from 'chokidar';

export const watchTasks = ['copy', 'img', 'svg'] as const;
export type WatchTask = (typeof watchTasks)[number];

const isWatchTask = (value: string): value is WatchTask => {
  return watchTasks.includes(value as WatchTask);
};

const taskPatterns: Record<WatchTask, string[]> = {
  copy: ['static/**'],
  img: ['src/assets/images/**'],
  svg: ['src/assets/svg-sprite/*.svg'],
};

const runTask = async (task: WatchTask, mode: AppMode, changedFile?: string) => {
  switch (task) {
    case 'copy': {
      await runStaticCopy(changedFile ? { mode, targets: changedFile } : { mode });
      break;
    }
    case 'img': {
      await runImageMin(changedFile || undefined);
      break;
    }
    case 'svg': {
      await runSvgSprite();
      break;
    }
  }
};

export const resolveWatchTasks = (values: string[]): WatchTask[] => {
  if (values.length === 0) return [...watchTasks];

  const invalidTasks = values.filter((value) => !isWatchTask(value));
  if (invalidTasks.length > 0) {
    throw new Error(`Unknown watch task: ${invalidTasks.join(', ')}`);
  }

  return values.filter((value): value is WatchTask => isWatchTask(value));
};

export const startWatch = async ({
  initialRun,
  mode,
  tasks,
}: {
  initialRun: boolean;
  mode: AppMode;
  tasks: WatchTask[];
}): Promise<void> => {
  const queueByTask = new Map<WatchTask, Promise<void>>();
  const enqueue = (task: WatchTask, file?: string) => {
    const current = queueByTask.get(task) || Promise.resolve();
    const next = current
      .catch((error) => {
        void error;
      })
      .then(() => runTask(task, mode, file))
      .catch((error) => {
        console.trace(error);
        process.exitCode = 1;
      });

    queueByTask.set(task, next);
  };

  if (initialRun) {
    for (const task of tasks) enqueue(task);
  }

  const watchers = tasks.map((task) => {
    const watcher = chokidar.watch(taskPatterns[task], {
      awaitWriteFinish: {
        pollInterval: 50,
        stabilityThreshold: 200,
      },
      ignoreInitial: true,
    });

    watcher
      .on('add', (filePath) => enqueue(task, filePath))
      .on('change', (filePath) => enqueue(task, filePath))
      .on('ready', () => {
        consoleDone(`watch:${task}`, 'ready');
      });

    return watcher;
  });

  await new Promise<void>((resolve) => {
    const close = async () => {
      await Promise.all(watchers.map((watcher) => watcher.close()));
      resolve();
    };

    process.once('SIGINT', close);
    process.once('SIGTERM', close);
  });
};
