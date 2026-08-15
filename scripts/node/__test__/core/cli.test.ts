import { isDirectRun, runCommandCli } from '@scripts-node/core/cli';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const startWatchMock = vi.fn();

vi.mock('@scripts-node/core/watch', () => ({
  startWatch: (options: unknown) => startWatchMock(options),
}));

describe('cli', () => {
  const originalArgv = process.argv;

  beforeEach(() => {
    vi.clearAllMocks();
    process.argv = [...originalArgv];
    process.exitCode = 0;
  });

  it('isDirectRun => false when entry differs', () => {
    process.argv = ['node', '/tmp/other.ts'];

    expect(isDirectRun('file:///tmp/command.ts')).toBe(false);
  });

  it('runCommandCli => skips run when imported', async () => {
    process.argv = ['node', '/tmp/other.ts', '--develop'];
    const run = vi.fn();

    await runCommandCli({ moduleUrl: 'file:///tmp/command.ts', run });

    expect(run).not.toHaveBeenCalled();
  });

  it('runCommandCli => passes resolved mode and targets', async () => {
    process.argv = ['node', '/tmp/command.ts', '--develop', 'src/assets/a.png'];
    const run = vi.fn();

    await runCommandCli({ moduleUrl: 'file:///tmp/command.ts', run });

    expect(run).toHaveBeenCalledWith({ mode: 'development', targets: ['src/assets/a.png'] });
  });

  it('runCommandCli => starts watch and filters changed files', async () => {
    process.argv = ['node', '/tmp/command.ts', '--watch'];
    const run = vi.fn();
    startWatchMock.mockImplementation(
      async (options: { run: (file?: string) => Promise<void> }) => {
        await options.run('src/assets/a.png');
        await options.run('src/assets/a.txt');
      },
    );

    await runCommandCli({
      moduleUrl: 'file:///tmp/command.ts',
      run,
      watch: {
        patterns: ['src/assets'],
        shouldRun: (changedFile) => changedFile.endsWith('.png'),
      },
    });

    expect(run).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledWith({
      changedFile: 'src/assets/a.png',
      mode: 'development',
      targets: [],
    });
  });

  it('runCommandCli => reports invalid options', async () => {
    process.argv = ['node', '/tmp/command.ts', '--unknown'];
    const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => 0);
    const run = vi.fn();

    await runCommandCli({ moduleUrl: 'file:///tmp/command.ts', run });

    expect(run).not.toHaveBeenCalled();
    expect(traceSpy).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
  });
});
