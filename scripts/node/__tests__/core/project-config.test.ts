import { afterEach, describe, expect, it, vi } from 'vitest';

describe('project.config', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    vi.resetModules();
    process.env.NODE_ENV = originalNodeEnv;
  });

  it('baseDir => development', async () => {
    process.env.NODE_ENV = 'development';
    const config = await import(`@root/project.config?env=dev-${Date.now()}`);
    expect(config.baseDir).toBe('/');
  });

  it('baseDir => production', async () => {
    process.env.NODE_ENV = 'production';
    const config = await import(`@root/project.config?env=prod-${Date.now()}`);
    expect(config.baseDir).toBe('/production/');
  });
});
