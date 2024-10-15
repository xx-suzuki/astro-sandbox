import fs from 'fs-extra';
import fg from 'fast-glob';
import validator from 'html-validator';
import type HtmlValidator from 'html-validator';
import { validateHtml as config } from '@root/project.config';
import { consoleDone, consoleExist, consoleError } from '@root/tasks/helper/drop-console';

const options:
  | HtmlValidator.OptionsForHtmlFileAsValidationTargetAndObjectAsResult
  | HtmlValidator.OptionsForExternalUrlAsValidationTargetAndObjectAsResult = {
  data: '',
  url: 'http://url-to-validate.com',
  format: 'json',
};

const init = async (): Promise<void> => {
  await fs.remove('./report-w3c.txt');

  const files = fg.sync(config.files, { ignore: config.ignore });
  if (files.length === 0) {
    return consoleExist('HTML');
  }

  const stream = fs.createWriteStream('./report-w3c.txt', { flags: 'a' });

  for (const file of files) {
    if ('data' in options) {
      options.data = fs.readFileSync(file, 'utf8');
    }
    try {
      const result = await validator(options);
      stream.write(`===========================\n>> ${file}\n`);
      if (result.messages.length === 0) {
        stream.write(`\n✨ No errors or warnings to show.\n`);
      } else {
        result.messages.forEach((msg) => {
          if ('lastLine' in msg) {
            stream.write(`\n[${msg.type}] line: ${msg.lastLine}\n${msg.message}\n`);
          } else {
            stream.write(`\n[${msg.type}] line: N/A\n${msg.message}\n`);
          }
        });
      }
      stream.write(`\n`);
    } catch (error) {
      consoleError(error as string);
    }
  }
  consoleDone();
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
