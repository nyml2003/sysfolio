import type { Result } from "./result.types";
import { err } from "./err";
import { ok } from "./ok";

export function fromThrowable<T>(fn: () => T): Result<unknown, T> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error);
  }
}
