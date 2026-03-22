import type { Result } from "./result.types";

export function err<E>(error: E): Result<E, never> {
  return { tag: "err", error };
}
