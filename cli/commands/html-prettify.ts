import type { HTMLBeautifyOptions } from 'js-beautify';

import { consoleDone, consoleExist } from '@cli/helper/drop-console';
import { htmlPrettify as config } from '@root/project.config';
import fg from 'fast-glob';
import beautify from 'js-beautify';
import { readFile, writeFile } from 'node:fs/promises';

// https://www.npmjs.com/package/js-beautify
const beautifyConfig: HTMLBeautifyOptions = {
  content_unformatted: ['style', 'blockquote', 'script'],
  extra_liners: [],
  indent_inner_html: true,
  indent_size: 2,
  inline: ['span', 'strong', 'b', 'small', 'del', 's', 'code', 'br', 'wbr'],
  max_preserve_newlines: 0,
};

const readWrite = async (file: string): Promise<void> => {
  const data = await readFile(file, 'utf8');
  const res = beautify.html(data, beautifyConfig);

  try {
    await writeFile(file, res);
    consoleDone('html-prettify', file);
  } catch (error) {
    console.error(error);
  }
};

const init = async (): Promise<void> => {
  const files = fg.sync(config.files, { ignore: config.ignore });

  if (files.length === 0) {
    return consoleExist('HTML');
  }

  await Promise.all(files.map((f) => readWrite(f)));
};

/** init */
try {
  await init();
} catch (error) {
  console.trace(error);
  process.exitCode = 1;
}
