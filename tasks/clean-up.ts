import fs from 'fs-extra';
import { cleanUp as config } from '@root/project.config';
import { consoleDone, consoleError } from '@root/tasks/helper/drop-console';

const init = async (): Promise<void> => {
  try {
    await Promise.all(config.map((target: string) => fs.remove(target)));
    consoleDone();
  } catch (err) {
    consoleError(String(err));
  }
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
