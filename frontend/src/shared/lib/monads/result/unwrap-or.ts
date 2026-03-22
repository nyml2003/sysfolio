import type { Result } from './result.types';
import { isOk } from './is-ok';

export function unwrapOr<E, T>(result: Result<E, T>, fallback: T): T {
  return isOk(result) ? result.value : fallback;
}
