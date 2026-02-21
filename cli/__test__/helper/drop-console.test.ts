import type { Stats } from 'node:fs';

import * as dropConsole from '@cli/helper/drop-console';
import fs from 'fs-extra';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const makeStats = (size: number): fs.Stats =>
  Object.assign(Object.create(fs.Stats.prototype), { size });

describe('drop-console', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('consoleSize => functionality test', () => {
    // Mock
    vi.spyOn(fs, 'statSync').mockReturnValue(makeStats(1000));
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => 0);

    // Init
    dropConsole.consoleSize('test.txt', 'task');

    // Inspect
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('test.txt'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('1 kB'));
  });

  it('consoleSizeCompare => functionality test', () => {
    // Mock
    const statSpy = vi
      .spyOn(fs, 'statSync')
      .mockReturnValueOnce({ size: 1000 } as Partial<Stats> as Stats)
      .mockReturnValueOnce({ size: 500 } as Partial<Stats> as Stats);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => 0);

    // Init
    dropConsole.consoleSizeCompare('input.txt', 'output.txt', 'task');

    // Inspect
    expect(statSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('output.txt'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('1 kB'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('500 B'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/\(50(\.0)? %\)/));
  });

  it('consoleExist => functionality test', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => 0);

    dropConsole.consoleExist('test.txt', 'task');

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('test.txt'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('File does not exist'));
  });

  it('consoleError => functionality test', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => 0);

    dropConsole.consoleError('error message', 'task');

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('error message'));
  });

  it('consoleGenerate => functionality test', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => 0);

    dropConsole.consoleGenerate('task');

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Generate'));
  });

  it('consoleDone => functionality test', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => 0);

    dropConsole.consoleDone('task', 'test.txt');

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('test.txt'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Done'));
  });

  it('consolePreview => functionality test', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => 0);

    dropConsole.consolePreview('http://localhost:3000', 'task');

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Preview >>'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('http://localhost:3000'));
  });
});
