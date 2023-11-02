import path from 'node:path';
import fs from 'fs-extra';
import color from 'picocolors';
import prettyBytes from 'pretty-bytes';

const taskName = path.basename(process.argv[1], '.mjs');

export const consoleSize = (file, task = taskName) => {
  const { size } = fs.statSync(file);
  console.log(`${color.gray(`[${task}]`)} ${color.blue(file)} ${color.magenta(prettyBytes(size))}`);
};

export const consoleSizeCompare = (input, output, task = taskName) => {
  const { size: inputSize } = fs.statSync(input);
  const { size: outputSize } = fs.statSync(output);
  const compressionSize = Math.round((outputSize / inputSize) * 1000) / 10;
  console.log(
    `${color.gray(`[${task}]`)} ${color.blue(output)} ${color.gray(
      `${prettyBytes(inputSize)} >`,
    )} ${color.magenta(prettyBytes(outputSize))} ${color.magenta(`(${compressionSize} %)`)}`,
  );
};

export const consoleExist = (file, task = taskName) => {
  console.log(`${color.gray(`[${task}]`)} ${color.red(`${file} File does not exist`)}`);
};

export const consoleError = (text, task = taskName) => {
  console.log(`${color.gray(`[${task}]`)} ${color.red(text)}`);
};

export const consoleGenerate = (task = taskName) => {
  console.log(`${color.gray(`[${task}]`)} ${color.blue('Generate')}`);
};

export const consoleDone = (task = taskName, file = '') => {
  console.log(`${color.gray(`[${task}]`)} ${color.blue(file)}${color.white(' Done✨')}`);
};

export const consolePreview = (url, task = taskName) => {
  console.log(`${color.gray(`[${task}]`)} Preview >> ${color.yellow(`${url}`)}`);
};
