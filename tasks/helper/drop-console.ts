import path from 'node:path';
import fs from 'fs-extra';
import color from 'picocolors';
import prettyBytes from 'pretty-bytes';

const taskName: string = path.basename(process.argv[1]!, '.ts');

export const consoleSize = (file: string, task: string = taskName): void => {
  const { size } = fs.statSync(file);
  console.log(`${color.gray(`[${task}]`)} ${color.blue(file)} ${color.magenta(prettyBytes(size))}`);
};

export const consoleSizeCompare = (
  input: string,
  output: string,
  task: string = taskName,
): void => {
  const { size: inputSize } = fs.statSync(input);
  const { size: outputSize } = fs.statSync(output);
  const compressionSize = Math.round((outputSize / inputSize) * 1000) / 10;
  console.log(
    `${color.gray(`[${task}]`)} ${color.blue(output)} ${color.gray(
      `${prettyBytes(inputSize)} >`,
    )} ${color.magenta(prettyBytes(outputSize))} ${color.magenta(`(${compressionSize} %)`)}`,
  );
};

export const consoleExist = (file: string, task: string = taskName): void => {
  console.log(`${color.gray(`[${task}]`)} ${color.red(`${file} File does not exist`)}`);
};

export const consoleError = (text: string, task: string = taskName): void => {
  console.log(`${color.gray(`[${task}]`)} ${color.red(text)}`);
};

export const consoleGenerate = (task: string = taskName): void => {
  console.log(`${color.gray(`[${task}]`)} ${color.blue('Generate')}`);
};

export const consoleDone = (task: string = taskName, file: string = ''): void => {
  console.log(`${color.gray(`[${task}]`)} ${color.blue(file)}${color.white(' Done✨')}`);
};

export const consolePreview = (url: string, task: string = taskName): void => {
  console.log(`${color.gray(`[${task}]`)} Preview >> ${color.yellow(`${url}`)}`);
};
