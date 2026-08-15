import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncMock = vi.fn();
const readFileMock = vi.fn();
const writeFileMock = vi.fn();
const beautifyHtmlMock = vi.fn();
const consoleDoneMock = vi.fn();
const consoleErrorMock = vi.fn();
const consoleExistMock = vi.fn();

vi.mock('fast-glob', () => ({
  default: {
    sync: syncMock,
  },
}));

vi.mock('node:fs/promises', () => ({
  readFile: readFileMock,
  writeFile: writeFileMock,
}));

vi.mock('js-beautify', () => ({
  default: {
    html: beautifyHtmlMock,
  },
}));

vi.mock('@scripts-node/helper/drop-console', () => ({
  consoleDone: consoleDoneMock,
  consoleError: consoleErrorMock,
  consoleExist: consoleExistMock,
}));

vi.mock('@root/project.config', () => ({
  htmlPrettify: {
    files: 'dist/**/*.html',
    ignore: ['**/assets/**'],
  },
}));

describe('html-prettify', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.exitCode = 0;
    syncMock.mockReturnValue([]);
    readFileMock.mockResolvedValue('<html><body></body></html>');
    writeFileMock.mockResolvedValue(undefined);
    beautifyHtmlMock.mockReturnValue('<html>\n\n<body></body>\n\n</html>');
  });

  it('runHtmlPrettify => no html files', async () => {
    const { runHtmlPrettify } = await import('@scripts-node/commands/html-prettify');
    await runHtmlPrettify();

    expect(consoleExistMock).toHaveBeenCalledWith('HTML');
    expect(writeFileMock).not.toHaveBeenCalled();
  });

  it('runHtmlPrettify => formats matched files', async () => {
    syncMock.mockReturnValue(['dist/index.html']);

    const { runHtmlPrettify } = await import('@scripts-node/commands/html-prettify');
    await runHtmlPrettify();

    expect(syncMock).toHaveBeenCalledWith('dist/**/*.html', { ignore: ['**/assets/**'] });
    expect(writeFileMock).toHaveBeenCalledWith(
      'dist/index.html',
      '<html>\n\n<body></body>\n\n</html>',
    );
    expect(consoleDoneMock).toHaveBeenCalledWith('html-prettify', 'dist/index.html');
    expect(process.exitCode).toBe(0);
  });

  it('runHtmlPrettify => reports write failure as an error exit', async () => {
    syncMock.mockReturnValue(['dist/index.html']);
    writeFileMock.mockRejectedValue(new Error('write failed'));

    const { runHtmlPrettify } = await import('@scripts-node/commands/html-prettify');
    await runHtmlPrettify();

    expect(consoleErrorMock).toHaveBeenCalledWith('write failed');
    expect(process.exitCode).toBe(1);
  });
});
