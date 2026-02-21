import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncMock = vi.fn();
const createFolderMock = vi.fn();
const isIgnoreFileMock = vi.fn();
const consoleExistMock = vi.fn();
const consoleSizeMock = vi.fn();
const consoleSizeCompareMock = vi.fn();
const readFileSyncMock = vi.fn();
const outputFileMock = vi.fn();
const copyMock = vi.fn();
const optimizeMock = vi.fn();

const toFileMock = vi.fn().mockResolvedValue();
const toFormatMock = vi.fn(() => ({ toFile: toFileMock }));
const avifMock = vi.fn(() => ({ toFile: toFileMock }));
const sharpFnMock = vi.fn(() => ({
  avif: avifMock,
  toFormat: toFormatMock,
}));

(sharpFnMock as unknown as { format: Record<string, object> }).format = {
  gif: {},
  jpeg: {},
  png: {},
};

vi.mock('fast-glob', () => ({
  default: {
    sync: syncMock,
  },
}));

vi.mock('@cli/helper/utils', () => ({
  createFolder: createFolderMock,
  isIgnoreFile: isIgnoreFileMock,
}));

vi.mock('@cli/helper/drop-console', () => ({
  consoleExist: consoleExistMock,
  consoleSize: consoleSizeMock,
  consoleSizeCompare: consoleSizeCompareMock,
}));

vi.mock('fs-extra', () => ({
  default: {
    copy: copyMock,
    outputFile: outputFileMock,
    readFileSync: readFileSyncMock,
  },
}));

vi.mock('svgo', () => ({
  optimize: optimizeMock,
}));

vi.mock('sharp', () => ({
  default: sharpFnMock,
}));

vi.mock('@root/project.config', () => ({
  imageMin: {
    base: 'src/assets/images',
    files: 'src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}',
    outDir: '.tmp/assets/images',
  },
}));

describe('image-min', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    syncMock.mockReturnValue([]);
    isIgnoreFileMock.mockReturnValue(false);
    outputFileMock.mockResolvedValue();
    copyMock.mockResolvedValue();
    readFileSyncMock.mockReturnValue('<svg />');
    optimizeMock.mockReturnValue({ data: '<svg/>' });
  });

  it('runImageMin => no files', async () => {
    const { runImageMin } = await import('@cli/commands/image-min');
    await runImageMin();
    expect(consoleExistMock).toHaveBeenCalledWith('Image');
  });

  it('runImageMin => optimize svg', async () => {
    syncMock.mockReturnValue(['src/assets/images/icon.svg']);
    const { runImageMin } = await import('@cli/commands/image-min');
    await runImageMin();

    expect(readFileSyncMock).toHaveBeenCalledWith('src/assets/images/icon.svg');
    expect(outputFileMock).toHaveBeenCalledWith('.tmp/assets/images/icon.svg', '<svg/>');
    expect(consoleSizeCompareMock).toHaveBeenCalled();
  });

  it('runImageMin => copy other extension', async () => {
    syncMock.mockReturnValue(['src/assets/images/readme.txt']);
    const { runImageMin } = await import('@cli/commands/image-min');
    await runImageMin();

    expect(copyMock).toHaveBeenCalledWith(
      'src/assets/images/readme.txt',
      '.tmp/assets/images/readme.txt',
    );
    expect(consoleSizeMock).toHaveBeenCalledWith('.tmp/assets/images/readme.txt');
  });
});
