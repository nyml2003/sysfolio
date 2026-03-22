import { none, some, type Option } from "@/shared/lib/monads/option";

export function getWindowOption(): Option<Window> {
  return typeof window === "undefined" ? none() : some(window);
}
