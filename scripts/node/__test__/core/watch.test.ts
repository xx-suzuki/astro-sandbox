import { beforeEach, describe, expect, it, vi } from 'vitest';

const watchMock = vi.fn();
const closeMock = vi.fn();
const onMock = vi.fn();
const callbacks: Record<string, (arg?: unknown) => void> = {};

vi.mock('chokidar', () => ({
  default: {
    watch: watchMock,
  },
}));

describe('watch', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    for (const key of Object.keys(callbacks)) {
      delete callbacks[key];
    }
    process.exitCode = 0;

    closeMock.mockImplementation(async () => {
      const isStateDone = true;
      void isStateDone;
    });
    onMock.mockImplementation((event: string, handler: (arg?: unknown) => void) => {
      callbacks[event] = handler;
      return watcher;
    });
    watchMock.mockReturnValue(watcher);
  });

  it('normalizeWatchPatterns => string', async () => {
    const { normalizeWatchPatterns } = await import('@scripts-node/core/watch');
    expect(normalizeWatchPatterns('src/assets/images/**')).toEqual(['src/assets/images/**']);
  });

  it('normalizeWatchPatterns => string array', async () => {
    const { normalizeWatchPatterns } = await import('@scripts-node/core/watch');
    expect(normalizeWatchPatterns(['static/**', 'src/assets/images/**'])).toEqual([
      'static/**',
      'src/assets/images/**',
    ]);
  });

  it('startWatch => enqueue initial/add/change and close by SIGINT', async () => {
    const runMock = vi.fn(async () => {
      const isStateRan = true;
      void isStateRan;
    });
    const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => 0);
    const { startWatch } = await import('@scripts-node/core/watch');

    const watchPromise = startWatch({
      initialRun: true,
      patterns: 'src/assets/images',
      run: runMock,
      watchOptions: { usePolling: true },
    });

    await Promise.resolve();
    callbacks.add?.('src/assets/images/a.jpg');
    callbacks.change?.('src/assets/images/b.jpg');
    callbacks.error?.(new Error('watch failed'));
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    process.emit('SIGINT');
    await watchPromise;

    expect(watchMock).toHaveBeenCalledWith(
      ['src/assets/images'],
      expect.objectContaining({ ignoreInitial: true, usePolling: true }),
    );
    expect(runMock).toHaveBeenCalledWith(undefined);
    expect(runMock).toHaveBeenCalledWith('src/assets/images/a.jpg');
    expect(runMock).toHaveBeenCalledWith('src/assets/images/b.jpg');
    expect(traceSpy).toHaveBeenCalled();
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it('startWatch => continues after run rejection and closes by SIGTERM', async () => {
    const runMock = vi
      .fn()
      .mockImplementationOnce(async () => {
        throw new Error('task failed');
      })
      .mockImplementationOnce(async () => {
        const isStateRecovered = true;
        void isStateRecovered;
      });
    const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => 0);
    const { startWatch } = await import('@scripts-node/core/watch');

    const watchPromise = startWatch({
      initialRun: false,
      patterns: ['static'],
      run: runMock,
    });

    callbacks.add?.('static/root/favicon.ico');
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));
    callbacks.change?.('static/root/favicon.ico');
    await Promise.resolve();
    await new Promise((resolve) => setTimeout(resolve, 0));

    process.emit('SIGTERM');
    await watchPromise;

    expect(runMock).toHaveBeenCalledTimes(2);
    expect(traceSpy).toHaveBeenCalled();
    expect(process.exitCode).toBe(1);
  });
});

const watcher = {
  close: closeMock,
  on: onMock,
};
