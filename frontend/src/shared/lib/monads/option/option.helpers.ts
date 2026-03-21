import type { Option } from "./option.types";

export function none(): Option<never> {
  return { tag: "none" };
}

export function some<T>(value: T): Option<T> {
  return { tag: "some", value };
}

export function isNone<T>(option: Option<T>): option is { tag: "none" } {
  return option.tag === "none";
}

export function isSome<T>(option: Option<T>): option is { tag: "some"; value: T } {
  return option.tag === "some";
}

export function map<T, U>(
  option: Option<T>,
  mapper: (value: T) => U,
): Option<U> {
  return isSome(option) ? some(mapper(option.value)) : none();
}

export function flatMap<T, U>(
  option: Option<T>,
  mapper: (value: T) => Option<U>,
): Option<U> {
  return isSome(option) ? mapper(option.value) : none();
}

export function match<T, U>(
  option: Option<T>,
  onNone: () => U,
  onSome: (value: T) => U,
): U {
  return isSome(option) ? onSome(option.value) : onNone();
}

export function unwrapOr<T>(option: Option<T>, fallback: T): T {
  return isSome(option) ? option.value : fallback;
}

export function orElse<T>(option: Option<T>, fallbackOption: Option<T>): Option<T> {
  return isSome(option) ? option : fallbackOption;
}

export function fromNullable<T>(raw: T | null | undefined): Option<T> {
  return raw === null || raw === undefined ? none() : some(raw);
}
