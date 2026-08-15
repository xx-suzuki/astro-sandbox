import type { AppMode } from '@scripts-node/core/context';

import { distDir, tmpDir } from '@root/project.config';
import { isDirectRun, runCommandCli } from '@scripts-node/core/cli';
import { consoleDone } from '@scripts-node/helper/drop-console';
import fs from 'fs-extra';

export const getCleanUpTargets = (mode: AppMode): string[] => {
  return mode === 'development' ? [tmpDir] : [tmpDir, distDir];
};

export async function cleanDir(targets: string[]) {
  if (!targets || targets.length === 0) return;
  for (const t of targets) {
    await fs.remove(t);
  }
}

export async function runCleanUp(mode: AppMode) {
  try {
    await cleanDir(getCleanUpTargets(mode));
    consoleDone();
  } catch (error) {
    console.trace(error);
    process.exitCode = 1;
  }
}

if (isDirectRun(import.meta.url)) {
  await runCommandCli({
    moduleUrl: import.meta.url,
    run: async ({ mode }) => runCleanUp(mode),
  });
}
