import type { Result } from './result.types';

export function ok<T>(value: T): Result<never, T> {
  return { tag: 'ok', value };
}
