import readline from 'node:readline';
import fs from 'fs-extra';
import { select } from '@inquirer/prompts';
import { fontAwesome as config } from '@root/project.config';
import { createFolder } from '@root/tasks/helper/utils';
import { consoleError, consoleGenerate } from '@root/tasks/helper/drop-console';

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

type IconMap = Record<string, IconData>;

type JsonData = Record<
  string,
  {
    svgs: SvgCollection;
    familyStylesByLicense: {
      pro: IconData[];
    };
  }
>;

// ----------------------------------
// Util Functions
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = async (choices: string[]): Promise<string> => {
  return select({
    message: 'Please choose a style:',
    choices: choices.map((choice) => ({ value: choice })),
  });
};

const getIconData = (jsonData: JsonData, name: string) => {
  const iconData = jsonData[name];
  if (!iconData) {
    consoleError(`Icon "${name}" not found in JSON data.`);
    return null;
  }

  const svg: SvgCollection = iconData.svgs;
  const families: IconData[] = iconData.familyStylesByLicense.pro;

  const choices: IconMap = families.reduce<IconMap>((acc, item) => {
    const key = `${item.family}-${item.style}`;
    acc[key] = item;
    return acc;
  }, {});

  return {
    choices,
    svg,
  };
};

const loadJsonFile = (filePath: string): JsonData | null => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent) as JsonData;
  } catch (error) {
    consoleError(`Failed to load or parse JSON file: ${(error as Error).message}`);
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
  data: { choices: IconMap; svg: SvgCollection },
) => {
  if (!data.choices || !data.svg) {
    consoleError(`"${name}" icon is not available.`);
    return;
  }

  let selectedStyle = Object.keys(data.choices)[0];
  if (Object.keys(data.choices).length > 1) {
    selectedStyle = await askQuestion(Object.keys(data.choices));
  }

  if (!selectedStyle || !(selectedStyle in data.choices)) {
    consoleError(`Selected style "${selectedStyle}" is not valid.`);
    return;
  }

  const iconData = data.choices[selectedStyle];
  const svg = data.svg[iconData!.family]?.[iconData!.style]?.raw;

  if (!svg) {
    consoleError(`No matching SVG data found.`);
    return;
  }

  const fileName = `${name}-${selectedStyle}.svg`.replace('classic-', '');
  saveSvgFile(`${config.outDir}/${fileName}`, svg);
};

// ----------------------------------
// Init
const init = async () => {
  const jsonData = loadJsonFile(config.file);
  if (!jsonData) {
    rl.close();
    return;
  }

  rl.question('Please enter icon name: ', async (name) => {
    const data = getIconData(jsonData, name);
    if (data) {
      await processIconSelection(name, data);
    }

    rl.close();
  });
};

init().catch((error) => {
  console.trace(error);
  process.exitCode = 1;
});
