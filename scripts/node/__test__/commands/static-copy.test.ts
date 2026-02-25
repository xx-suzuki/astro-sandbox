import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncMock = vi.fn();
const copyMock = vi.fn();
const existsSyncMock = vi.fn();
const consoleExistMock = vi.fn();
const consoleSizeMock = vi.fn();
const isIgnoreFileMock = vi.fn();

vi.mock('fast-glob', () => ({
  default: {
    sync: syncMock,
  },
}));

vi.mock('fs-extra', () => ({
  default: {
    copy: copyMock,
    existsSync: existsSyncMock,
  },
}));

vi.mock('@scripts-node/helper/drop-console', () => ({
  consoleExist: consoleExistMock,
  consoleSize: consoleSizeMock,
}));

vi.mock('@scripts-node/helper/utils', () => ({
  isIgnoreFile: isIgnoreFileMock,
}));

vi.mock('@root/project.config', () => ({
  staticCopy: [
    {
      base: 'static/assets',
      outDir: '.tmp/assets',
      useProduction: true,
    },
    {
      base: 'static/root',
      outDir: '.tmp',
      useProduction: false,
    },
  ],
}));

describe('static-copy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    syncMock.mockReturnValue([]);
    existsSyncMock.mockReturnValue(false);
    copyMock.mockResolvedValue();
    isIgnoreFileMock.mockReturnValue(false);
  });

  it('runStaticCopy => no files', async () => {
    const { runStaticCopy } = await import('@scripts-node/commands/static-copy');
    await runStaticCopy({ mode: 'development' });

    expect(consoleExistMock).toHaveBeenCalledWith('Static');
    expect(copyMock).not.toHaveBeenCalled();
  });

  it('runStaticCopy => copy by mode and target', async () => {
    syncMock.mockReturnValue(['static/root/favicon.ico']);

    const { runStaticCopy } = await import('@scripts-node/commands/static-copy');
    await runStaticCopy({ mode: 'development' });

    expect(copyMock).toHaveBeenCalledWith('static/root/favicon.ico', '.tmp/favicon.ico');
    expect(consoleSizeMock).toHaveBeenCalledWith('.tmp/favicon.ico');
  });

  it('runStaticCopy => ignore files', async () => {
    syncMock.mockReturnValue(['static/root/.DS_Store']);
    isIgnoreFileMock.mockReturnValue(true);

    const { runStaticCopy } = await import('@scripts-node/commands/static-copy');
    await runStaticCopy({ mode: 'development' });

    expect(copyMock).not.toHaveBeenCalled();
  });

  it('runStaticCopy => literal target path', async () => {
    existsSyncMock.mockReturnValue(true);
    const { runStaticCopy } = await import('@scripts-node/commands/static-copy');
    await runStaticCopy({ mode: 'development', targets: 'static/root/favicon.ico' });

    expect(syncMock).not.toHaveBeenCalled();
    expect(copyMock).toHaveBeenCalledWith('static/root/favicon.ico', '.tmp/favicon.ico');
  });

  it('runStaticCopy => glob fallback when target path does not exist', async () => {
    existsSyncMock.mockReturnValue(false);
    syncMock.mockReturnValue(['static/assets/app.js']);
    const { runStaticCopy } = await import('@scripts-node/commands/static-copy');
    await runStaticCopy({ mode: 'development', targets: 'static/assets/**/*.js' });

    expect(syncMock).toHaveBeenCalledWith('static/assets/**/*.js');
    expect(copyMock).toHaveBeenCalledWith('static/assets/app.js', '.tmp/assets/app.js');
  });

  it('runStaticCopy => skips when no config target matches', async () => {
    syncMock.mockReturnValue(['foo/bar.txt']);
    const { runStaticCopy } = await import('@scripts-node/commands/static-copy');
    await runStaticCopy({ mode: 'development' });

    expect(copyMock).not.toHaveBeenCalled();
  });

  it('runStaticCopy => supports array targets', async () => {
    existsSyncMock.mockReturnValue(true);
    const { runStaticCopy } = await import('@scripts-node/commands/static-copy');
    await runStaticCopy({
      mode: 'development',
      targets: ['static/root/favicon.ico', 'static/assets/main.css'],
    });

    expect(copyMock).toHaveBeenCalledWith('static/root/favicon.ico', '.tmp/favicon.ico');
    expect(copyMock).toHaveBeenCalledWith('static/assets/main.css', '.tmp/assets/main.css');
  });
});
