import type { AppMode } from '@scripts-node/core/context';

import { distDir, tmpDir } from '@root/project.config';
import { applyMode } from '@scripts-node/core/context';
import { parseCommandCliArgs } from '@scripts-node/helper/cli-args';
import { consoleDone } from '@scripts-node/helper/drop-console';
import fs from 'fs-extra';
import { pathToFileURL } from 'node:url';

export const getCleanUpTargets = (mode: AppMode): string[] => {
  return mode === 'development' ? [tmpDir] : [tmpDir, distDir];
};

export async function cleanDir(targets: string[]) {
  if (!targets || targets.length <= 0) return;
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

/* c8 ignore start */
const isDirectRun =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    const cliArgs = parseCommandCliArgs(process.argv.slice(2), {
      allowWatch: true,
      fallbackMode: 'production',
    });
    await runCleanUp(applyMode(cliArgs.mode));
  } catch (error) {
    console.trace(error);
    process.exitCode = 1;
  }
}
/* c8 ignore end */
