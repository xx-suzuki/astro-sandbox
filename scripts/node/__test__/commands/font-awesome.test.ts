import { beforeEach, describe, expect, it, vi } from 'vitest';

const inputMock = vi.fn();
const selectMock = vi.fn();
const readFileSyncMock = vi.fn();
const writeFileSyncMock = vi.fn();
const createFolderMock = vi.fn();
const consoleErrorMock = vi.fn();
const consoleGenerateMock = vi.fn();

vi.mock('@inquirer/prompts', () => ({
  input: inputMock,
  select: selectMock,
}));

vi.mock('fs-extra', () => ({
  default: {
    readFileSync: readFileSyncMock,
    writeFileSync: writeFileSyncMock,
  },
}));

vi.mock('@scripts-node/helper/utils', () => ({
  createFolder: createFolderMock,
}));

vi.mock('@scripts-node/helper/drop-console', () => ({
  consoleError: consoleErrorMock,
  consoleGenerate: consoleGenerateMock,
}));

vi.mock('@root/project.config', () => ({
  fontAwesome: {
    file: 'scripts/node/data/icon-families.json',
    outDir: 'src/assets/svg-sprite',
  },
}));

const iconJson = (families: { family: string; style: string }[]) =>
  JSON.stringify({
    house: {
      familyStylesByLicense: { pro: families },
      svgs: {
        classic: {
          solid: { raw: '<svg>solid</svg>' },
        },
        sharp: {
          solid: { raw: '<svg>sharp</svg>' },
        },
      },
    },
  });

describe('font-awesome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    readFileSyncMock.mockReturnValue(iconJson([{ family: 'classic', style: 'solid' }]));
    inputMock.mockResolvedValue('house');
  });

  it('runFontAwesome => saves svg without asking when only one style exists', async () => {
    const { runFontAwesome } = await import('@scripts-node/commands/font-awesome');
    await runFontAwesome();

    expect(selectMock).not.toHaveBeenCalled();
    expect(createFolderMock).toHaveBeenCalledWith('src/assets/svg-sprite');
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      'src/assets/svg-sprite/house-solid.svg',
      '<svg>solid</svg>',
    );
    expect(consoleGenerateMock).toHaveBeenCalledTimes(1);
  });

  it('runFontAwesome => asks for a style when several exist', async () => {
    readFileSyncMock.mockReturnValue(
      iconJson([
        { family: 'classic', style: 'solid' },
        { family: 'sharp', style: 'solid' },
      ]),
    );
    selectMock.mockResolvedValue('sharp-solid');

    const { runFontAwesome } = await import('@scripts-node/commands/font-awesome');
    await runFontAwesome();

    expect(selectMock).toHaveBeenCalledTimes(1);
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      'src/assets/svg-sprite/house-sharp-solid.svg',
      '<svg>sharp</svg>',
    );
  });

  it('runFontAwesome => reports unknown icon name', async () => {
    inputMock.mockResolvedValue('unknown-icon');

    const { runFontAwesome } = await import('@scripts-node/commands/font-awesome');
    await runFontAwesome();

    expect(consoleErrorMock).toHaveBeenCalledWith('Icon "unknown-icon" not found in JSON data.');
    expect(writeFileSyncMock).not.toHaveBeenCalled();
  });

  it('runFontAwesome => reports unreadable json', async () => {
    readFileSyncMock.mockImplementation(() => {
      throw new Error('no such file');
    });

    const { runFontAwesome } = await import('@scripts-node/commands/font-awesome');
    await runFontAwesome();

    expect(consoleErrorMock).toHaveBeenCalledWith(
      'Failed to load or parse JSON file: no such file',
    );
    expect(inputMock).not.toHaveBeenCalled();
  });
});
