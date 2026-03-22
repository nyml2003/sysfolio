import type { Result } from "./result.types";
import { isOk } from "./is-ok";
import { ok } from "./ok";

export function map<E, T, U>(result: Result<E, T>, mapper: (value: T) => U): Result<E, U> {
  return isOk(result) ? ok(mapper(result.value)) : result;
}
