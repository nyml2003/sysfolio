import type { Option } from "./option.types";

export function none(): Option<never> {
  return { tag: "none" };
}
