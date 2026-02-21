import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncMock = vi.fn();
const copyMock = vi.fn();
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
  },
}));

vi.mock('@cli/helper/drop-console', () => ({
  consoleExist: consoleExistMock,
  consoleSize: consoleSizeMock,
}));

vi.mock('@cli/helper/utils', () => ({
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
    copyMock.mockResolvedValue();
    isIgnoreFileMock.mockReturnValue(false);
  });

  it('runStaticCopy => no files', async () => {
    const { runStaticCopy } = await import('@cli/commands/static-copy');
    await runStaticCopy({ mode: 'development' });

    expect(consoleExistMock).toHaveBeenCalledWith('Static');
    expect(copyMock).not.toHaveBeenCalled();
  });

  it('runStaticCopy => copy by mode and target', async () => {
    syncMock.mockReturnValue(['static/root/favicon.ico']);

    const { runStaticCopy } = await import('@cli/commands/static-copy');
    await runStaticCopy({ mode: 'development' });

    expect(copyMock).toHaveBeenCalledWith('static/root/favicon.ico', '.tmp/favicon.ico');
    expect(consoleSizeMock).toHaveBeenCalledWith('.tmp/favicon.ico');
  });

  it('runStaticCopy => ignore files', async () => {
    syncMock.mockReturnValue(['static/root/.DS_Store']);
    isIgnoreFileMock.mockReturnValue(true);

    const { runStaticCopy } = await import('@cli/commands/static-copy');
    await runStaticCopy({ mode: 'development' });

    expect(copyMock).not.toHaveBeenCalled();
  });
});
