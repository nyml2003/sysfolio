import type { Result } from "./result.types";

export function ok<T>(value: T): Result<never, T> {
  return { tag: "ok", value };
}

export function err<E>(error: E): Result<E, never> {
  return { tag: "err", error };
}

export function isOk<E, T>(result: Result<E, T>): result is { tag: "ok"; value: T } {
  return result.tag === "ok";
}

export function isErr<E, T>(
  result: Result<E, T>,
): result is { tag: "err"; error: E } {
  return result.tag === "err";
}

export function map<E, T, U>(
  result: Result<E, T>,
  mapper: (value: T) => U,
): Result<E, U> {
  return isOk(result) ? ok(mapper(result.value)) : result;
}

export function mapErr<E, T, F>(
  result: Result<E, T>,
  mapper: (error: E) => F,
): Result<F, T> {
  return isErr(result) ? err(mapper(result.error)) : result;
}

export function andThen<E, T, U, F = E>(
  result: Result<E, T>,
  mapper: (value: T) => Result<F, U>,
): Result<E | F, U> {
  return isOk(result) ? mapper(result.value) : result;
}

export function match<E, T, U>(
  result: Result<E, T>,
  onErr: (error: E) => U,
  onOk: (value: T) => U,
): U {
  return isOk(result) ? onOk(result.value) : onErr(result.error);
}

export function unwrapOr<E, T>(result: Result<E, T>, fallback: T): T {
  return isOk(result) ? result.value : fallback;
}

export function fromThrowable<T>(fn: () => T): Result<unknown, T> {
  try {
    return ok(fn());
  } catch (error) {
    return err(error);
  }
}

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
