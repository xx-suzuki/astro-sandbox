import fs from 'fs-extra';
import path from 'node:path';
import { expect, it, vi } from 'vitest';

describe('clean-up', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.exitCode = 0;
  });

  it('cleanDir => removes directories', async () => {
    // Mock
    const testDir = path.resolve('.test');
    await fs.ensureDir(testDir);
    expect(await fs.pathExists(testDir)).toBe(true);

    // Init
    const { cleanDir } = await import('@cli/commands/clean-up');
    await cleanDir(['.test']);

    // Inspect
    expect(await fs.pathExists(testDir)).toBe(false);
  });

  it('cleanDir => does nothing when config is empty', async () => {
    // Mock
    const removeSpy = vi.spyOn(fs, 'remove').mockResolvedValue();
    // Init
    const { cleanDir } = await import('@cli/commands/clean-up');
    await cleanDir([]);

    // Inspect
    expect(removeSpy).not.toHaveBeenCalled();
  });

  it('runCleanUp => success', async () => {
    const removeSpy = vi.spyOn(fs, 'remove').mockResolvedValue();
    vi.doMock('@cli/helper/drop-console', () => ({
      consoleDone: vi.fn(),
    }));
    const drop = await import('@cli/helper/drop-console');
    const consoleDoneSpy = vi.spyOn(drop, 'consoleDone');

    // Init
    const { runCleanUp } = await import('@cli/commands/clean-up');
    await runCleanUp('development');

    // Inspect
    expect(removeSpy).toHaveBeenCalledTimes(1);
    expect(removeSpy).toHaveBeenCalledWith('.tmp');
    expect(consoleDoneSpy).toHaveBeenCalledTimes(1);
  });

  it('runCleanUp => error', async () => {
    vi.spyOn(fs, 'remove').mockRejectedValue(new Error('remove failed'));
    const traceSpy = vi.spyOn(console, 'trace').mockImplementation(() => 0);
    vi.doMock('@cli/helper/drop-console', () => ({ consoleDone: vi.fn() }));

    // Init
    const { runCleanUp } = await import('@cli/commands/clean-up');
    await runCleanUp('development');

    // Inspect
    expect(traceSpy).toHaveBeenCalledTimes(1);
    expect(process.exitCode).toBe(1);
  });

  it('getCleanUpTargets => returns targets by mode', async () => {
    const { getCleanUpTargets } = await import('@cli/commands/clean-up');

    expect(getCleanUpTargets('development')).toEqual(['.tmp']);
    expect(getCleanUpTargets('production')).toEqual(['.tmp', 'dist']);
  });
});
