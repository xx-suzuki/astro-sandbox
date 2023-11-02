import fs from 'fs-extra';
import fg from 'fast-glob';
import validator from 'html-validator';
import { validateHtml as config } from '../project.config.mjs';
import { consoleDone, consoleExist, consoleError } from './helper/drop-console.mjs';

const options = {
  url: 'http://url-to-validate.com',
  format: 'json',
};

const init = async () => {
  await fs.remove('./report-w3c.txt');

  const files = fg.sync(config.files, { ignore: config.ignore });
  if (!fs.existsSync(files[0])) {
    return consoleExist('HTML');
  }

  const stream = fs.createWriteStream('./report-w3c.txt', { flags: 'a' });

  for (const file of files) {
    options.data = fs.readFileSync(file, 'utf8');
    try {
      const result = await validator(options);
      stream.write(`===========================\n>> ${file}\n`);
      if (result.messages.length === 0) {
        stream.write(`\n✨ No errors or warnings to show.\n`);
      } else {
        result.messages.forEach((msg) => {
          stream.write(`\n[${msg.type}] line: ${msg.lastLine}\n${msg.message}\n`);
        });
      }
      stream.write(`\n`);
    } catch (error) {
      consoleError(error);
    }
  }
  consoleDone();
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
