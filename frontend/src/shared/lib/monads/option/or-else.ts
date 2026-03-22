import type { Option } from "./option.types";
import { isSome } from "./is-some";

export function orElse<T>(option: Option<T>, fallbackOption: Option<T>): Option<T> {
  return isSome(option) ? option : fallbackOption;
}
