import fs from 'fs-extra';
import { cleanUp as config } from '../project.config.mjs';
import { consoleDone, consoleError } from './helper/drop-console';

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
