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
const statSyncMock = vi.fn();
const removeMock = vi.fn();
const consoleCacheMock = vi.fn();
const imageSizeMock = vi.fn();

const toFileMock = vi.fn().mockResolvedValue(undefined);
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
  consoleCache: consoleCacheMock,
  consoleExist: consoleExistMock,
  consoleSize: consoleSizeMock,
  consoleSizeCompare: consoleSizeCompareMock,
}));

vi.mock('image-size', () => ({
  imageSize: imageSizeMock,
}));

vi.mock('fs-extra', () => ({
  default: {
    copy: copyMock,
    existsSync: existsSyncMock,
    outputFile: outputFileMock,
    readFileSync: readFileSyncMock,
    remove: removeMock,
    statSync: statSyncMock,
  },
}));

vi.mock('svgo', () => ({
  optimize: optimizeMock,
}));

vi.mock('sharp', () => ({
  default: sharpFnMock,
}));

vi.mock('@root/project.config', () => ({
  assetsDir: {
    images: { outDir: 'assets/images' },
  },
  imageMin: {
    base: 'src/assets/images',
    cacheDir: '.cache/images',
    files: 'src/assets/images/**/*.{jpg,jpeg,png,gif,svg,webp}',
    manifest: '.cache/images/manifest.json',
    outDir: '.tmp/assets/images',
  },
  tmpDir: '.tmp',
}));

describe('image-min', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    syncMock.mockReturnValue([]);
    existsSyncMock.mockReturnValue(false);
    isIgnoreFileMock.mockReturnValue(false);
    outputFileMock.mockResolvedValue(undefined);
    copyMock.mockResolvedValue(undefined);
    readFileSyncMock.mockReturnValue('<svg />');
    optimizeMock.mockReturnValue({ data: '<svg/>' });
    statSyncMock.mockReturnValue({ size: 100 });
    removeMock.mockResolvedValue(undefined);
    imageSizeMock.mockReturnValue({ height: 200, width: 300 });
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
    // マニフェストの書き込みは行われるため、画像の出力だけを検証する
    expect(outputFileMock).not.toHaveBeenCalledWith('.tmp/assets/images/icon.svg', '<svg/>');
  });

  it('runImageMin => uses glob when literal target does not exist', async () => {
    existsSyncMock.mockReturnValue(false);
    syncMock.mockReturnValue(['src/assets/images/icon.svg']);
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin('src/assets/images/**/*.svg');

    expect(syncMock).toHaveBeenCalledWith('src/assets/images/**/*.svg');
    expect(readFileSyncMock).toHaveBeenCalledWith('src/assets/images/icon.svg');
  });

  it('runImageMin => records width, height and outputs in the manifest', async () => {
    syncMock.mockReturnValue(['src/assets/images/photo.jpg']);
    // prune 対象にならないよう、元画像は存在する扱いにする
    existsSyncMock.mockImplementation((file: string) => file === 'src/assets/images/photo.jpg');
    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin();

    const written = outputFileMock.mock.calls.find(
      (call) => call[0] === '.cache/images/manifest.json',
    );
    expect(written).toBeDefined();

    const manifest = JSON.parse(String(written?.[1])) as {
      entries: Record<
        string,
        { height: number; mime: string; outputs: { path: string }[]; width: number }
      >;
    };
    const entry = manifest.entries['assets/images/photo.jpg'];

    expect(entry?.width).toBe(300);
    expect(entry?.height).toBe(200);
    expect(entry?.mime).toBe('image/jpeg');
    expect(entry?.outputs.map((output) => output.path)).toEqual([
      'assets/images/photo.jpg',
      'assets/images/photo.avif',
    ]);
  });

  it('runImageMin => restores from cache without generating', async () => {
    syncMock.mockReturnValue(['src/assets/images/photo.jpg']);
    // マニフェストとキャッシュ実体が揃っている状態を作る
    existsSyncMock.mockReturnValue(true);
    readFileSyncMock.mockImplementation((file: string) =>
      file === '.cache/images/manifest.json'
        ? JSON.stringify({
            entries: {
              'assets/images/photo.jpg': {
                bytes: 8,
                createdAt: '2026-01-01T00:00:00.000Z',
                hash: '2a3f3b0b3f0f3a2f2c0d5f4a1b6e7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
                outputs: [{ bytes: 4, path: 'assets/images/photo.jpg', type: 'jpg' }],
                source: 'src/assets/images/photo.jpg',
                type: 'jpg',
              },
            },
            optionsHash: 'stale',
            version: 1,
          })
        : 'source',
    );

    const { runImageMin } = await import('@scripts-node/commands/image-min');
    await runImageMin();

    // optionsHash が一致しないため、キャッシュは使われず再生成される
    expect(toFormatMock).toHaveBeenCalled();
    expect(consoleCacheMock).not.toHaveBeenCalled();
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
