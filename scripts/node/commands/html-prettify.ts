import type { HTMLBeautifyOptions } from 'js-beautify';

import { htmlPrettify as config } from '@root/project.config';
import { isDirectRun, runCommandCli } from '@scripts-node/core/cli';
import { consoleDone, consoleError, consoleExist } from '@scripts-node/helper/drop-console';
import fg from 'fast-glob';
import beautify from 'js-beautify';
import { readFile, writeFile } from 'node:fs/promises';

// ----------------------------------
// Config
// https://www.npmjs.com/package/js-beautify
const beautifyConfig: HTMLBeautifyOptions = {
  content_unformatted: ['style', 'blockquote', 'script'],
  extra_liners: [],
  indent_inner_html: true,
  indent_size: 2,
  inline: ['span', 'strong', 'b', 'small', 'del', 's', 'code', 'br', 'wbr'],
  max_preserve_newlines: 0,
};

// ----------------------------------
// Functions
const readWrite = async (file: string): Promise<void> => {
  const data = await readFile(file, 'utf8');
  const res = beautify.html(data, beautifyConfig);

  try {
    await writeFile(file, res);
    consoleDone('html-prettify', file);
  } catch (error) {
    // 整形に失敗したまま成功扱いでビルドを通さない
    consoleError(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
};

export const runHtmlPrettify = async (
  options: { files: string | string[]; ignore: string[] } = config,
): Promise<void> => {
  const files = fg.sync(options.files, { ignore: options.ignore });

  if (files.length === 0) {
    return consoleExist('HTML');
  }

  await Promise.all(files.map((f) => readWrite(f)));
};

if (isDirectRun(import.meta.url)) {
  await runCommandCli({
    allowWatch: false,
    moduleUrl: import.meta.url,
    run: async () => runHtmlPrettify(),
  });
}
