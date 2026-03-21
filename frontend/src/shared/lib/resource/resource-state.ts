import type { Option } from "@/shared/lib/monads/option";
import { none } from "@/shared/lib/monads/option";

export type ResourceState<T, E> =
  | { tag: "idle" }
  | { tag: "loading" }
  | { tag: "ready"; value: T }
  | { tag: "empty"; reason: Option<string> }
  | { tag: "error"; error: E };

export function idleState<T, E>(): ResourceState<T, E> {
  return { tag: "idle" };
}

export function loadingState<T, E>(): ResourceState<T, E> {
  return { tag: "loading" };
}

export function readyState<T, E>(value: T): ResourceState<T, E> {
  return { tag: "ready", value };
}

export function emptyState<T, E>(reason: Option<string> = none()): ResourceState<T, E> {
  return { tag: "empty", reason };
}

export function errorState<T, E>(error: E): ResourceState<T, E> {
  return { tag: "error", error };
}
