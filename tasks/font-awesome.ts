import readline from 'node:readline';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import { fontAwesome as config } from '../project.config.mjs';
import { createFolder } from './helper/utils.mjs';
import { consoleError, consoleExist, consoleGenerate } from './helper/drop-console.mjs';

// ----------------------------------
// Types
type SvgData = {
  last_modified: number;
  raw: string;
  viewBox: [number, number, number, number];
  width: number;
  height: number;
  path: string | string[];
};

type SvgCollection = {
  svg: Record<string, SvgData>;
};

// ----------------------------------
// Util
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = async (choices: string[]): Promise<string> => {
  const { selectedOption } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedOption',
      message: 'Please choose a style:',
      choices: choices,
    },
  ]);

  return selectedOption;
};

const getIconData = (jsonData: Record<string, any>, name: string) => {
  const iconData = jsonData[name];
  return {
    styles: iconData?.styles as string[] | undefined,
    svg: iconData?.svg as SvgCollection | undefined,
  };
};

const loadJsonFile = (filePath: string): Record<string, any> | null => {
  try {
    const file = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(file);
  } catch (error) {
    consoleError(`Failed to load or parse JSON file: ${error.message}`);
    return null;
  }
};

const saveSvgFile = (filePath: string, svgContent: string) => {
  createFolder(config.outDir);
  fs.writeFileSync(filePath, svgContent);
  consoleGenerate();
};

const processIconSelection = async (
  name: string,
  data: { styles: string[] | undefined; svg: SvgCollection | undefined },
) => {
  if (!data.svg || !data.styles) {
    consoleError(`"${name}" icon is not available.`);
    return;
  }

  let selectedStyle: string;
  if (data.styles.length > 1) {
    selectedStyle = await askQuestion(data.styles);
  } else {
    selectedStyle = data.styles[0];
  }

  saveSvgFile(`${config.outDir}/${name}-${selectedStyle}.svg`, data.svg[selectedStyle].raw);
};

// ----------------------------------
// init
const init = async () => {
  rl.question('Please enter icon name: ', async (name) => {
    const jsonData = loadJsonFile(config.file);
    if (!jsonData) {
      consoleExist();
      rl.close();
      return;
    }

    const data = getIconData(jsonData, name);
    await processIconSelection(name, data);

    rl.close();
  });
};

init().catch((error) => {
  console.trace(error);
  process.exitCode = 1;
});
