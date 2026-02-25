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
const existsSyncMock = vi.fn();
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

vi.mock('@scripts-node/helper/utils', () => ({
  createFolder: createFolderMock,
  isIgnoreFile: isIgnoreFileMock,
}));

vi.mock('@scripts-node/helper/drop-console', () => ({
  consoleExist: consoleExistMock,
  consoleSize: consoleSizeMock,
  consoleSizeCompare: consoleSizeCompareMock,
}));

vi.mock('fs-extra', () => ({
  default: {
    copy: copyMock,
    existsSync: existsSyncMock,
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
    existsSyncMock.mockReturnValue(false);
    isIgnoreFileMock.mockReturnValue(false);
    outputFileMock.mockResolvedValue();
    copyMock.mockResolvedValue();
    readFileSyncMock.mockReturnValue('<svg />');
    optimizeMock.mockReturnValue({ data: '<svg/>' });
    (sharpFnMock as unknown as { format: Record<string, object> }).format = {
      gif: {},
      jpeg: {},
      png: {},
    };
  });

  it('runImageMin => no files', async () => {
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin();
    expect(consoleExistMock).toHaveBeenCalledWith('Image');
  });

  it('runImageMin => optimize svg', async () => {
    syncMock.mockReturnValue(['src/assets/images/icon.svg']);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin();

    expect(readFileSyncMock).toHaveBeenCalledWith('src/assets/images/icon.svg');
    expect(outputFileMock).toHaveBeenCalledWith('.tmp/assets/images/icon.svg', '<svg/>');
    expect(consoleSizeCompareMock).toHaveBeenCalled();
  });

  it('runImageMin => copy other extension', async () => {
    syncMock.mockReturnValue(['src/assets/images/readme.txt']);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin();

    expect(copyMock).toHaveBeenCalledWith(
      'src/assets/images/readme.txt',
      '.tmp/assets/images/readme.txt',
    );
    expect(consoleSizeMock).toHaveBeenCalledWith('.tmp/assets/images/readme.txt');
  });

  it('runImageMin => literal target path', async () => {
    existsSyncMock.mockReturnValue(true);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin('src/assets/images/icon.svg');

    expect(syncMock).not.toHaveBeenCalled();
    expect(readFileSyncMock).toHaveBeenCalledWith('src/assets/images/icon.svg');
  });

  it('runImageMin => optimize jpg and avif', async () => {
    syncMock.mockReturnValue(['src/assets/images/photo.jpg']);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin();

    expect(toFormatMock).toHaveBeenCalled();
    expect(avifMock).toHaveBeenCalled();
    expect(consoleSizeCompareMock).toHaveBeenCalledWith(
      'src/assets/images/photo.jpg',
      '.tmp/assets/images/photo.jpg',
    );
    expect(consoleSizeCompareMock).toHaveBeenCalledWith(
      'src/assets/images/photo.jpg',
      '.tmp/assets/images/photo.avif',
    );
  });

  it('runImageMin => skips unsupported sharp format', async () => {
    (sharpFnMock as unknown as { format: Record<string, object> }).format = {
      jpeg: {},
      png: {},
    };
    syncMock.mockReturnValue(['src/assets/images/anim.gif']);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin();

    expect(toFormatMock).not.toHaveBeenCalled();
    expect(avifMock).not.toHaveBeenCalled();
  });

  it('runImageMin => ignores file when helper returns true', async () => {
    isIgnoreFileMock.mockReturnValue(true);
    syncMock.mockReturnValue(['src/assets/images/icon.svg']);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin();

    expect(readFileSyncMock).not.toHaveBeenCalled();
    expect(copyMock).not.toHaveBeenCalled();
    expect(outputFileMock).not.toHaveBeenCalled();
  });

  it('runImageMin => uses glob when literal target does not exist', async () => {
    existsSyncMock.mockReturnValue(false);
    syncMock.mockReturnValue(['src/assets/images/icon.svg']);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin('src/assets/images/**/*.svg');

    expect(syncMock).toHaveBeenCalledWith('src/assets/images/**/*.svg');
    expect(readFileSyncMock).toHaveBeenCalledWith('src/assets/images/icon.svg');
  });

  it('runImageMin => supports array targets', async () => {
    existsSyncMock.mockReturnValue(true);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin(['src/assets/images/a.svg', 'src/assets/images/b.svg']);

    expect(syncMock).not.toHaveBeenCalled();
    expect(readFileSyncMock).toHaveBeenCalledWith('src/assets/images/a.svg');
    expect(readFileSyncMock).toHaveBeenCalledWith('src/assets/images/b.svg');
  });
});
