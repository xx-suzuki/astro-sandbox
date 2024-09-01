import readline from 'node:readline';
import fs from 'fs-extra';
import { select } from "@inquirer/prompts";
import { fontAwesome as config } from '../project.config.mjs';
import { createFolder } from './helper/utils';
import { consoleError, consoleGenerate } from './helper/drop-console';

// ----------------------------------
// Types
type SvgData = {
  lastModified: number;
  raw: string;
  viewBox: [number, number, number, number];
  width: number;
  height: number;
  path: string | string[];
};

type SvgCollection = {
  [family: string]: {
    [style: string]: SvgData;
  };
};

type IconData = {
  family: string;
  style: string;
};

type IconMap = {
  [key: string]: IconData;
};


// ----------------------------------
// Util
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = async (choices: string[]): Promise<string> => {
  const selectedOption = await select(
    {
      message: 'Please choose a style:',
      choices: choices.map(choice => ({ value: choice })),
    },
  );

  return selectedOption;
};

const getIconData = (jsonData: Record<string, any>, name: string) => {
  const iconData = jsonData[name];
  const svg: SvgCollection = iconData['svgs'];
  const families: IconData[] = iconData['familyStylesByLicense']['pro'];
  const choices: IconMap = families.reduce((acc, item) => {
    const key = `${item.family}-${item.style}`;
    acc[key] = item;
    return acc;
  }, {});

  return {
    choices,
    svg
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
  data: { choices: IconMap, svg: SvgCollection},
) => {
  if (!data.choices || !data.svg) {
    consoleError(`"${name}" icon is not available.`);
    return;
  }

  let selectedStyle = Object.keys(data.choices)[0];
  if (Object.keys(data.choices).length > 1) {
    selectedStyle = await askQuestion(Object.keys(data.choices));
  }

  const { family, style } = data.choices[selectedStyle];

  const svg = data.svg[family][style].raw;
  if(!svg) {
    consoleError(`No matching SVG data found.`);
    return;
  }

  const fileName = `${name}-${selectedStyle}.svg`.replace('classic-', '');

  saveSvgFile(`${config.outDir}/${fileName}`, svg);
};

// ----------------------------------
// init
const init = async () => {
  const jsonData = loadJsonFile(config.file);
  if (!jsonData) {
    rl.close();
    return;
  }

  rl.question('Please enter icon name: ', async (name) => {
    const data = getIconData(jsonData, name);
    await processIconSelection(name, data);

    rl.close();
  });
};

init().catch((error) => {
  console.trace(error);
  process.exitCode = 1;
});
