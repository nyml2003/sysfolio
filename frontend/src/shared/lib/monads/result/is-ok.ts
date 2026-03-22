import type { Result } from "./result.types";

export function isOk<E, T>(result: Result<E, T>): result is { tag: "ok"; value: T } {
  return result.tag === "ok";
}
