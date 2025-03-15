import fg from 'fast-glob';
import fs from 'fs-extra';
import { HtmlValidate } from 'html-validate';
import { validateHtml as config } from '@root/project.config';
import { consoleDone, consoleExist, consoleError } from '@root/tasks/helper/drop-console';

const htmlValidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
});

const init = async (): Promise<void> => {
  await fs.remove('./report-w3c.txt');

  const files = fg.sync(config.files, { ignore: config.ignore });
  if (files.length === 0) {
    return consoleExist('HTML');
  }

  const stream = fs.createWriteStream('./report-w3c.txt', { flags: 'a' });

  for (const file of files) {
    try {
      const htmlContent = fs.readFileSync(file, 'utf8');
      const report = await htmlValidate.validateString(htmlContent);

      stream.write(`===========================\n>> ${file}\n`);

      if (report.valid) {
        stream.write(`\n✨ No errors or warnings to show.\n`);
      } else {
        report.results.forEach((result) => {
          result.messages.forEach((msg) => {
            console.log(msg);
            stream.write(
              `\n[${msg.severity === 2 ? 'error' : 'warning'}] line: ${msg.line || 'N/A'}\n${msg.message}\n`,
            );
          });
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
