import type { Result } from './result.types';
import { isOk } from './is-ok';

export function andThen<E, T, U, F = E>(
  result: Result<E, T>,
  mapper: (value: T) => Result<F, U>
): Result<E | F, U> {
  return isOk(result) ? mapper(result.value) : result;
}
