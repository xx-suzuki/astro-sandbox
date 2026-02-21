import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncMock = vi.fn();
const writeFileMock = vi.fn();
const readFileSyncMock = vi.fn();
const mkdirSyncMock = vi.fn();
const writeFileSyncMock = vi.fn();
const createFolderMock = vi.fn();
const consoleExistMock = vi.fn();
const consoleGenerateMock = vi.fn();
const optimizeMock = vi.fn();
const addMock = vi.fn();
const compileAsyncMock = vi.fn();

function SpriteMock() {
  return {
    add: addMock,
    compileAsync: compileAsyncMock,
  };
}

const spriteCtorMock = vi.fn(SpriteMock);

vi.mock('fast-glob', () => ({
  default: {
    sync: syncMock,
  },
}));

vi.mock('fs-extra', () => ({
  default: {
    mkdirSync: mkdirSyncMock,
    readFileSync: readFileSyncMock,
    writeFile: writeFileMock,
    writeFileSync: writeFileSyncMock,
  },
}));

vi.mock('svg-sprite', () => ({
  default: spriteCtorMock,
}));

vi.mock('svgo', () => ({
  optimize: optimizeMock,
}));

vi.mock('@cli/helper/utils', () => ({
  createFolder: createFolderMock,
}));

vi.mock('@cli/helper/drop-console', () => ({
  consoleExist: consoleExistMock,
  consoleGenerate: consoleGenerateMock,
}));

vi.mock('@root/project.config', () => ({
  svgSprite: {
    files: 'src/assets/svg-sprite/*.svg',
    outDir: '.tmp/assets/images',
    outName: 'sprite',
  },
}));

describe('svg-sprite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    syncMock.mockReturnValue([]);
    writeFileMock.mockResolvedValue();
    readFileSyncMock.mockReturnValue('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
    optimizeMock.mockReturnValue({ data: '<svg></svg>' });
    compileAsyncMock.mockResolvedValue({
      result: {
        symbol: {
          sprite: {
            contents: '<svg />',
            path: '.tmp/assets/images/sprite.svg',
          },
        },
      },
    });
  });

  it('runSvgSprite => no files', async () => {
    const { runSvgSprite } = await import('@cli/commands/svg-sprite');
    await runSvgSprite();

    expect(consoleExistMock).toHaveBeenCalledWith('SVG');
  });

  it('runSvgSprite => generate sprite, types and scss', async () => {
    syncMock.mockReturnValue(['src/assets/svg-sprite/home icon.svg']);
    const { runSvgSprite } = await import('@cli/commands/svg-sprite');
    await runSvgSprite();

    expect(spriteCtorMock).toHaveBeenCalledTimes(1);
    expect(addMock).toHaveBeenCalledTimes(1);
    expect(writeFileSyncMock).toHaveBeenCalled();
    expect(createFolderMock).toHaveBeenCalled();
    expect(consoleGenerateMock).toHaveBeenCalledTimes(1);
  });
});
