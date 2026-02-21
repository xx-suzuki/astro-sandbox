import { applyMode, resolveMode } from '@cli/context';
import { describe, expect, it } from 'vitest';

describe('context', () => {
  it('resolveMode => resolves by options', () => {
    expect(resolveMode({ develop: true })).toBe('development');
    expect(resolveMode({ production: true })).toBe('production');
    expect(resolveMode({}, 'development')).toBe('development');
  });

  it('resolveMode => throws when both mode flags are enabled', () => {
    expect(() => resolveMode({ develop: true, production: true })).toThrowError(
      'Use either --develop or --production.',
    );
  });

  it('applyMode => sets NODE_ENV', () => {
    applyMode('development');
    expect(process.env.NODE_ENV).toBe('development');
  });
});
