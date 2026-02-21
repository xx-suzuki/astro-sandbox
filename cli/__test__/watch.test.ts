import { resolveWatchTasks } from '@cli/watch';
import { describe, expect, it } from 'vitest';

describe('watch', () => {
  it('resolveWatchTasks => default tasks', () => {
    expect(resolveWatchTasks([])).toEqual(['copy', 'img', 'svg']);
  });

  it('resolveWatchTasks => validate tasks', () => {
    expect(resolveWatchTasks(['copy', 'svg'])).toEqual(['copy', 'svg']);
    expect(() => resolveWatchTasks(['invalid'])).toThrowError('Unknown watch task: invalid');
  });
});
