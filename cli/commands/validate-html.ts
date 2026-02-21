import { consoleDone, consoleError, consoleExist } from '@cli/helper/drop-console';
import { validateHtml as config } from '@root/project.config';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { HtmlValidate } from 'html-validate';
import { MLEngine } from 'markuplint';
import { pathToFileURL } from 'node:url';

const htmlValidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
});

const init = async ({
  files,
  ignore,
}: {
  files: string | string[];
  ignore: string[];
}): Promise<void> => {
  await fs.remove('./report-w3c.txt');

  const htmlFiles = fg.sync(files, { ignore });
  if (htmlFiles.length === 0) {
    return consoleExist('HTML');
  }

  const stream = fs.createWriteStream('./report-w3c.txt', { flags: 'a' });

  for (const file of htmlFiles) {
    try {
      const htmlContent = fs.readFileSync(file, 'utf8');
      stream.write(`===========================\n>> ${file}\n`);

      // html-validate
      const htmlReport = await htmlValidate.validateString(htmlContent);
      stream.write(`\nhtml-validate:\n`);
      if (htmlReport.valid) {
        stream.write(`✨ No errors or warnings.\n`);
      } else {
        for (const result of htmlReport.results) {
          for (const msg of result.messages) {
            stream.write(
              `\n[${msg.severity === 2 ? 'error' : 'warning'}] line: ${msg.line || 'N/A'}\n${msg.message}\n`,
            );
          }
        }
      }

      // markuplint
      const mlFile = await MLEngine.toMLFile(file);
      if (mlFile) {
        const engine = new MLEngine(mlFile, {
          locale: 'ja',
        });
        const result = await engine.exec();

        stream.write(`\nmarkuplint:\n`);

        if (result && result.violations.length > 0) {
          for (const v of result.violations) {
            stream.write(`[${v.severity}] ${v.line}:${v.col} ${v.message} (${v.ruleId})\n`);
          }
        } else {
          stream.write(`✨ No violations.\n`);
        }
      }

      stream.write(`\n`);
    } catch (error) {
      consoleError(error as string);
    }
  }
  consoleDone();
};

export const runValidateHtml = async (
  options: { files: string | string[]; ignore: string[] } = config,
): Promise<void> => {
  await init(options);
};

const isDirectRun =
  typeof process.argv[1] === 'string' && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    await runValidateHtml();
  } catch (error) {
    console.trace(error);
    process.exitCode = 1;
  }
}
