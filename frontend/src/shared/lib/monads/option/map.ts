import type { Option } from "./option.types";
import { isSome } from "./is-some";
import { none } from "./none";
import { some } from "./some";

export function map<T, U>(option: Option<T>, mapper: (value: T) => U): Option<U> {
  return isSome(option) ? some(mapper(option.value)) : none();
}
