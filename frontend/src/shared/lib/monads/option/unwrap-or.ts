import type { Option } from "./option.types";
import { isSome } from "./is-some";

export function unwrapOr<T>(option: Option<T>, fallback: T): T {
  return isSome(option) ? option.value : fallback;
}
