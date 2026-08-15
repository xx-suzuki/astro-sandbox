import { validateHtml as config } from '@root/project.config';
import { isDirectRun, runCommandCli } from '@scripts-node/core/cli';
import { consoleDone, consoleError, consoleExist } from '@scripts-node/helper/drop-console';
import fg from 'fast-glob';
import fs from 'fs-extra';
import { HtmlValidate } from 'html-validate';
import { MLEngine } from 'markuplint';

// ----------------------------------
// Config
const htmlValidate = new HtmlValidate({
  extends: ['html-validate:recommended'],
});

// ----------------------------------
// Functions
const init = async ({
  files,
  ignore,
  report,
}: {
  files: string | string[];
  ignore: string[];
  report: string;
}): Promise<void> => {
  await fs.remove(report);

  const htmlFiles = fg.sync(files, { ignore });
  if (htmlFiles.length === 0) {
    return consoleExist('HTML');
  }

  const stream = fs.createWriteStream(report, { flags: 'a' });

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
      consoleError(error instanceof Error ? error.message : String(error));
    }
  }

  // 書き込み完了を待たないとレポート末尾が欠ける
  await new Promise<void>((resolve) => {
    stream.end(resolve);
  });

  consoleDone();
};

export const runValidateHtml = async (
  options: { files: string | string[]; ignore: string[]; report: string } = config,
): Promise<void> => {
  await init(options);
};

if (isDirectRun(import.meta.url)) {
  await runCommandCli({
    allowWatch: false,
    moduleUrl: import.meta.url,
    run: async () => runValidateHtml(),
  });
}
