import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncMock = vi.fn();
const removeMock = vi.fn();
const readFileSyncMock = vi.fn();
const writeMock = vi.fn();
const consoleDoneMock = vi.fn();
const consoleErrorMock = vi.fn();
const consoleExistMock = vi.fn();
const validateStringMock = vi.fn();
const toMLFileMock = vi.fn();
const execMock = vi.fn();

class HtmlValidateMock {
  validateString = validateStringMock;
}

class MLEngineMock {
  static toMLFile = toMLFileMock;
  exec = execMock;
}

vi.mock('fast-glob', () => ({
  default: {
    sync: syncMock,
  },
}));

vi.mock('fs-extra', () => ({
  default: {
    createWriteStream: vi.fn(() => ({
      write: writeMock,
    })),
    readFileSync: readFileSyncMock,
    remove: removeMock,
  },
}));

vi.mock('html-validate', () => ({
  HtmlValidate: HtmlValidateMock,
}));

vi.mock('markuplint', () => ({
  MLEngine: MLEngineMock,
}));

vi.mock('@scripts-node/helper/drop-console', () => ({
  consoleDone: consoleDoneMock,
  consoleError: consoleErrorMock,
  consoleExist: consoleExistMock,
}));

describe('validate-html', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    removeMock.mockResolvedValue();
    syncMock.mockReturnValue([]);
    readFileSyncMock.mockReturnValue('<html></html>');
    validateStringMock.mockResolvedValue({ results: [], valid: true });
    toMLFileMock.mockResolvedValue();
    execMock.mockResolvedValue({ violations: [] });
  });

  it('runValidateHtml => no html files', async () => {
    const { runValidateHtml } = await import('@scripts-node/commands/validate-html');
    await runValidateHtml({
      files: 'dist/**/*.html',
      ignore: ['**/assets/**'],
    });

    expect(consoleExistMock).toHaveBeenCalledWith('HTML');
  });

  it('runValidateHtml => outputs report', async () => {
    syncMock.mockReturnValue(['dist/index.html']);

    const { runValidateHtml } = await import('@scripts-node/commands/validate-html');
    await runValidateHtml({
      files: 'dist/**/*.html',
      ignore: ['**/assets/**'],
    });

    expect(removeMock).toHaveBeenCalledWith('./report-w3c.txt');
    expect(validateStringMock).toHaveBeenCalledWith('<html></html>');
    expect(writeMock).toHaveBeenCalled();
    expect(consoleDoneMock).toHaveBeenCalledTimes(1);
    expect(consoleErrorMock).not.toHaveBeenCalled();
  });

  it('runValidateHtml => writes html warnings and markuplint violations', async () => {
    syncMock.mockReturnValue(['dist/index.html']);
    validateStringMock.mockResolvedValue({
      results: [
        {
          messages: [
            { line: 10, message: 'bad tag', severity: 2 },
            { line: 12, message: 'warn tag', severity: 1 },
            { message: 'warn without line', severity: 1 },
          ],
        },
      ],
      valid: false,
    });
    toMLFileMock.mockResolvedValue({ filePath: 'dist/index.html' });
    execMock.mockResolvedValue({
      violations: [{ col: 2, line: 1, message: 'bad aria', ruleId: 'attr-req', severity: 'error' }],
    });

    const { runValidateHtml } = await import('@scripts-node/commands/validate-html');
    await runValidateHtml({
      files: 'dist/**/*.html',
      ignore: ['**/assets/**'],
    });

    expect(writeMock).toHaveBeenCalled();
    expect(consoleDoneMock).toHaveBeenCalledTimes(1);
  });

  it('runValidateHtml => catches per-file read errors', async () => {
    syncMock.mockReturnValue(['dist/index.html']);
    readFileSyncMock.mockImplementation(() => {
      throw new Error('read failed');
    });

    const { runValidateHtml } = await import('@scripts-node/commands/validate-html');
    await runValidateHtml({
      files: 'dist/**/*.html',
      ignore: ['**/assets/**'],
    });

    expect(consoleErrorMock).toHaveBeenCalled();
    expect(consoleDoneMock).toHaveBeenCalledTimes(1);
  });

  it('runValidateHtml => writes no-violations text when markuplint has no issues', async () => {
    syncMock.mockReturnValue(['dist/index.html']);
    toMLFileMock.mockResolvedValue({ filePath: 'dist/index.html' });
    execMock.mockResolvedValue({ violations: [] });

    const { runValidateHtml } = await import('@scripts-node/commands/validate-html');
    await runValidateHtml({
      files: 'dist/**/*.html',
      ignore: ['**/assets/**'],
    });

    expect(writeMock).toHaveBeenCalledWith(expect.stringContaining('✨ No violations.'));
  });
});
