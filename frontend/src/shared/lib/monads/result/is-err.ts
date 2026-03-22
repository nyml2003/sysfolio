import type { Result } from './result.types';

export function isErr<E, T>(result: Result<E, T>): result is { tag: 'err'; error: E } {
  return result.tag === 'err';
}
