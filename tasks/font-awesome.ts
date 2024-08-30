import readline from 'node:readline';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { fontAwesome as config } from '../project.config.mjs';
import { createFolder } from './helper/utils.mjs';
import { consoleError, consoleExist } from './helper/drop-console.mjs';

// ----------------------------------
// Types
type SvgData = {
  last_modified: number;
  raw: string;
  viewBox: [number, number, number, number];
  width: number;
  height: number;
  path: string | string[];
}

type SvgCollection = {
  svg: Record<string, SvgData>;
}

// ----------------------------------
// Util
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = async (choices: string[]) => {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedOption',
      message: 'Please choose a style:',
      choices: choices,
    },
  ]);

  return answers.selectedOption;
}

const getIconData = (jsonData: Record<string, any>, number: string) => {
  return {
    styles: jsonData[number]?.styles as string[],
    svg: jsonData[number]?.svg as SvgCollection,
  };
}

// ----------------------------------
// init
const init = async () => {
  rl.question('Please enter icon name: ', async (name) => {
    const file = fs.readFileSync(config.file, { encoding: 'utf-8' });
    if (!file) {
      consoleExist();
      rl.close();
    };

    // Jsonデータに変換し対象アイコンがあるかチェック
    const jsonData = JSON.parse(file);
    const data = getIconData(jsonData, name);
    if (!data.svg) {
      consoleError(`"${name}" icon is not available.`);
      rl.close();
    };

    // 選択肢を表示
    const result = {
      svg: '',
      dist: ''
    }
    if (1 < data.styles.length) {
      const select = await askQuestion(data.styles);
      result.svg = data.svg[select as any].raw;
      result.dist = `${config.outDir}/${name}-${select}.svg`;
    } else {
      result.svg = data.svg[data.styles[0]].raw;
      result.dist = `${config.outDir}/${name}-${data.styles[0]}.svg`;
    }
    createFolder(config.outDir);
    fs.writeFileSync(result.dist, result.svg);

    rl.close();
  });
};

init().catch((e) => {
  console.trace(e);
  process.exitCode = 1;
});
