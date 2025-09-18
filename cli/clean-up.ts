import { consoleDone } from '@root/cli/helper/drop-console';
import { cleanUp as config } from '@root/project.config';
import fs from 'fs-extra';

try {
  await Promise.all(config.map((target: string) => fs.remove(target)));
  consoleDone();
} catch (error) {
  console.trace(error);
  process.exitCode = 1;
}
