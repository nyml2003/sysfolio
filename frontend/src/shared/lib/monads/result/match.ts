import type { Result } from "./result.types";
import { isOk } from "./is-ok";

export function match<E, T, U>(
  result: Result<E, T>,
  onErr: (error: E) => U,
  onOk: (value: T) => U,
): U {
  return isOk(result) ? onOk(result.value) : onErr(result.error);
}
