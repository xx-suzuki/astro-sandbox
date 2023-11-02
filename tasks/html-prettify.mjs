import { readFile, writeFile } from 'node:fs/promises';
import fg from 'fast-glob';
import fs from 'fs-extra';
import beautify from 'js-beautify';
import { htmlPrettify as config } from '../project.config.mjs';
import { consoleDone, consoleExist } from './helper/drop-console.mjs';

// https://www.npmjs.com/package/js-beautify
const beautifyConfig = {
  indent_size: 2,
  max_preserve_newlines: 0,
  indent_inner_html: true,
  extra_liners: [],
  content_unformatted: ['style', 'blockquote', 'script'],
  inline: ['span', 'strong', 'b', 'small', 'del', 's', 'code', 'br', 'wbr'],
};

const readWrite = async (file) => {
  const data = await readFile(file, 'utf-8');
  const res = beautify.html(data, beautifyConfig);

  try {
    await writeFile(file, res);
    consoleDone('html-prettify', file);
  } catch (err) {
    console.error(err);
  }
};

const init = async () => {
  const files = fg.sync(config.files, { ignore: config.ignore });

  if (!fs.existsSync(files[0])) {
    return consoleExist('HTML');
  }

  await Promise.all(files.map(readWrite));
};

/** init */
init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
