import fs from 'fs-extra';
import { cleanUp as config } from '../project.config.mjs';
import { consoleDone, consoleError } from './helper/drop-console.mjs';

const init = async () => {
  try {
    await Promise.all(config.map((target) => fs.remove(target)));
    consoleDone();
  } catch (err) {
    consoleError(err);
  }
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
