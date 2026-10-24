import { parseCommandCliArgs } from '@scripts-node/helper/cli-args';
import { describe, expect, test } from 'vitest';

describe('parseCommandCliArgs', () => {
  test('returns fallback production mode with no args', () => {
    const result = parseCommandCliArgs([], {
      allowWatch: true,
      fallbackMode: 'production',
    });

    expect(result.mode).toBe('production');
    expect(result.watch).toBe(false);
    expect(result.initialRun).toBe(true);
    expect(result.targets).toEqual([]);
  });

  test('parses develop flag and targets', () => {
    const result = parseCommandCliArgs(['--', '-d', 'static/root/favicon.ico'], {
      allowWatch: true,
      fallbackMode: 'production',
    });

    expect(result.mode).toBe('development');
    expect(result.targets).toEqual(['static/root/favicon.ico']);
  });

  test('parses watch flag and no-initial', () => {
    const result = parseCommandCliArgs(['-w', '--no-initial'], {
      allowWatch: true,
      fallbackMode: 'production',
    });

    expect(result.watch).toBe(true);
    expect(result.initialRun).toBe(false);
    expect(result.mode).toBe('development');
  });

  test('watch defaults to no initial run', () => {
    const result = parseCommandCliArgs(['-w'], {
      allowWatch: true,
      fallbackMode: 'production',
    });

    expect(result.watch).toBe(true);
    expect(result.initialRun).toBe(false);
    expect(result.mode).toBe('development');
  });

  test('watch can enable initial run by --initial', () => {
    const result = parseCommandCliArgs(['-w', '--initial'], {
      allowWatch: true,
      fallbackMode: 'production',
    });

    expect(result.watch).toBe(true);
    expect(result.initialRun).toBe(true);
    expect(result.mode).toBe('development');
  });

  test('throws when watch is not allowed', () => {
    expect(() =>
      parseCommandCliArgs(['-w'], {
        allowWatch: false,
        fallbackMode: 'production',
      }),
    ).toThrow('This command does not support --watch.');
  });

  test('throws on unknown option', () => {
    expect(() =>
      parseCommandCliArgs(['--unknown'], {
        allowWatch: true,
        fallbackMode: 'production',
      }),
    ).toThrow('Unknown option: --unknown');
  });

  test('throws when initial and no-initial are both set', () => {
    expect(() =>
      parseCommandCliArgs(['-w', '--initial', '--no-initial'], {
        allowWatch: true,
        fallbackMode: 'production',
      }),
    ).toThrow('Use either --initial or --no-initial.');
  });
});
