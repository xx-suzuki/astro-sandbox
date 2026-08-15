import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncMock = vi.fn();
const existsSyncMock = vi.fn();

vi.mock('fast-glob', () => ({
  default: {
    sync: syncMock,
  },
}));

vi.mock('fs-extra', () => ({
  default: {
    existsSync: existsSyncMock,
  },
}));

describe('targets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    syncMock.mockReturnValue([]);
    existsSyncMock.mockReturnValue(false);
  });

  it('resolveTargets => returns literal path without glob', async () => {
    existsSyncMock.mockReturnValue(true);
    const { resolveTargets } = await import('@scripts-node/helper/targets');

    expect(resolveTargets('static/root/favicon.ico')).toEqual(['static/root/favicon.ico']);
    expect(syncMock).not.toHaveBeenCalled();
  });

  it('resolveTargets => falls back to glob when path does not exist', async () => {
    syncMock.mockReturnValue(['static/assets/app.js']);
    const { resolveTargets } = await import('@scripts-node/helper/targets');

    expect(resolveTargets('static/assets/**/*.js')).toEqual(['static/assets/app.js']);
    expect(syncMock).toHaveBeenCalledWith('static/assets/**/*.js');
  });

  it('resolveTargets => accepts array and removes duplicates', async () => {
    syncMock.mockReturnValue(['static/assets/app.js']);
    const { resolveTargets } = await import('@scripts-node/helper/targets');

    expect(resolveTargets(['static/assets/**/*.js', 'static/assets/**/*.js'])).toEqual([
      'static/assets/app.js',
    ]);
  });
});
