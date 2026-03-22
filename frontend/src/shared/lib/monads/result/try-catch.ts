import type { Result } from "./result.types";
import { err } from "./err";
import { ok } from "./ok";

export function tryCatch<T, E>(
  fn: () => T,
  mapError: (error: unknown) => E,
): Result<E, T> {
  try {
    return ok(fn());
  } catch (error) {
    return err(mapError(error));
  }
}
