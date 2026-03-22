import type { Result } from "./result.types";
import { err } from "./err";
import { isErr } from "./is-err";

export function mapErr<E, T, F>(
  result: Result<E, T>,
  mapper: (error: E) => F,
): Result<F, T> {
  return isErr(result) ? err(mapper(result.error)) : result;
}
