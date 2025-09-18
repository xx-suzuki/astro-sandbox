import { select } from '@inquirer/prompts';
import { consoleError, consoleGenerate } from '@root/cli/helper/drop-console';
import { createFolder } from '@root/cli/helper/utils';
import { fontAwesome as config } from '@root/project.config';
import fs from 'fs-extra';
import readline from 'node:readline';

interface IconData {
  family: string;
  style: string;
}

type IconMap = Record<string, IconData>;

type JsonData = Record<
  string,
  {
    familyStylesByLicense: {
      pro: IconData[];
    };
    svgs: SvgCollection;
  }
>;

type SvgCollection = Record<string, Record<string, SvgData>>;

// ----------------------------------
// Types
interface SvgData {
  height: number;
  lastModified: number;
  path: string | string[];
  raw: string;
  viewBox: [number, number, number, number];
  width: number;
}

// ----------------------------------
// Util Functions
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = async (choices: string[]): Promise<string> => {
  return select({
    choices: choices.map((choice) => ({ value: choice })),
    message: 'Please choose a style:',
  });
};

const getIconData = (jsonData: JsonData, name: string) => {
  const iconData = jsonData[name];
  if (!iconData) {
    consoleError(`Icon "${name}" not found in JSON data.`);
    return;
  }

  const svg: SvgCollection = iconData.svgs;
  const families: IconData[] = iconData.familyStylesByLicense.pro;

  const choices: IconMap = {};
  for (const item of families) {
    const key = `${item.family}-${item.style}`;
    choices[key] = item;
  }

  return {
    choices,
    svg,
  };
};

const loadJsonFile = (filePath: string): JsonData | undefined => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent) as JsonData;
  } catch (error) {
    consoleError(`Failed to load or parse JSON file: ${(error as Error).message}`);
    return;
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

/** init */
try {
  await init();
} catch (error) {
  console.trace(error);
  process.exitCode = 1;
}
