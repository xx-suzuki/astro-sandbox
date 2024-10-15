import { readFile, writeFile } from 'node:fs/promises';
import fg from 'fast-glob';
import beautify from 'js-beautify';
import type { HTMLBeautifyOptions } from 'js-beautify';
import { htmlPrettify as config } from '@root/project.config';
import { consoleDone, consoleExist } from './helper/drop-console';

// https://www.npmjs.com/package/js-beautify
const beautifyConfig: HTMLBeautifyOptions = {
  indent_size: 2,
  max_preserve_newlines: 0,
  indent_inner_html: true,
  extra_liners: [],
  content_unformatted: ['style', 'blockquote', 'script'],
  inline: ['span', 'strong', 'b', 'small', 'del', 's', 'code', 'br', 'wbr'],
};

const readWrite = async (file: string): Promise<void> => {
  const data = await readFile(file, 'utf-8');
  const res = beautify.html(data, beautifyConfig);

  try {
    await writeFile(file, res);
    consoleDone('html-prettify', file);
  } catch (err) {
    console.error(err);
  }
};

const init = async (): Promise<void> => {
  const files = fg.sync(config.files, { ignore: config.ignore });

  if (files.length === 0) {
    return consoleExist('HTML');
  }

  await Promise.all(files.map(readWrite));
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
