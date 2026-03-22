import type { Option } from "./option.types";

export function some<T>(value: T): Option<T> {
  return { tag: "some", value };
}
