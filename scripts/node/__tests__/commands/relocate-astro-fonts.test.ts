import { beforeEach, describe, expect, it, vi } from 'vitest';

const fgMock = vi.fn();
const readFileMock = vi.fn();
const writeFileMock = vi.fn();
const pathExistsMock = vi.fn();
const ensureDirMock = vi.fn();
const copyMock = vi.fn();
const removeMock = vi.fn();
const consoleSizeMock = vi.fn();
const consoleDoneMock = vi.fn();
const consoleExistMock = vi.fn();
const removeEmptyDirMock = vi.fn();

vi.mock('fast-glob', () => ({
  default: fgMock,
}));

vi.mock('fs-extra', () => ({
  default: {
    copy: copyMock,
    ensureDir: ensureDirMock,
    pathExists: pathExistsMock,
    readFile: readFileMock,
    remove: removeMock,
    writeFile: writeFileMock,
  },
}));

vi.mock('@scripts-node/helper/drop-console', () => ({
  consoleDone: consoleDoneMock,
  consoleExist: consoleExistMock,
  consoleSize: consoleSizeMock,
}));

vi.mock('@scripts-node/helper/utils', () => ({
  removeEmptyDir: removeEmptyDirMock,
}));

describe('relocate-astro-fonts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fgMock.mockResolvedValue([]);
    readFileMock.mockResolvedValue('<html><link href="/_astro/fonts/a.woff2"></html>');
    writeFileMock.mockResolvedValue(undefined);
    pathExistsMock.mockResolvedValue(true);
    ensureDirMock.mockResolvedValue(undefined);
    copyMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);
    removeEmptyDirMock.mockResolvedValue(true);
  });

  it('runRelocateAstroFonts => move and rewrite fonts', async () => {
    fgMock
      .mockResolvedValueOnce(['/abs/dist/index.html'])
      .mockResolvedValueOnce(['/abs/dist/_astro/fonts/a.woff2']);

    const { runRelocateAstroFonts } = await import('@scripts-node/commands/relocate-astro-fonts');
    await runRelocateAstroFonts({
      baseDir: '/',
      distDir: '/abs/dist',
      targetFontPath: 'assets/fonts',
    });

    expect(writeFileMock).toHaveBeenCalled();
    expect(copyMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(consoleDoneMock).toHaveBeenCalledTimes(1);
  });

  it('runRelocateAstroFonts => missing source dir', async () => {
    pathExistsMock.mockResolvedValue(false);

    const { runRelocateAstroFonts } = await import('@scripts-node/commands/relocate-astro-fonts');
    await runRelocateAstroFonts({
      baseDir: '/',
      distDir: '/abs/dist',
      targetFontPath: 'assets/fonts',
    });

    expect(consoleExistMock).toHaveBeenCalledTimes(1);
  });

  it('runRelocateAstroFonts => skip html write when no replacement', async () => {
    fgMock.mockResolvedValueOnce(['/abs/dist/index.html']).mockResolvedValueOnce([]);
    readFileMock.mockResolvedValue('<html><body>No fonts</body></html>');

    const { runRelocateAstroFonts } = await import('@scripts-node/commands/relocate-astro-fonts');
    await runRelocateAstroFonts({
      baseDir: '/',
      distDir: '/abs/dist',
      targetFontPath: 'assets/fonts',
    });

    expect(writeFileMock).not.toHaveBeenCalledWith(
      '/abs/dist/index.html',
      expect.anything(),
      'utf8',
    );
  });
});
