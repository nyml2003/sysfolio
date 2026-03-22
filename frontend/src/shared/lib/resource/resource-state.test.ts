import { describe, expect, it } from "vitest";

import { none, some } from "@/shared/lib/monads/option";

import {
  emptyState,
  errorState,
  idleState,
  loadingState,
  readyState,
} from "./resource-state";

describe("resource-state", () => {
  it("builds discriminated unions", () => {
    expect(idleState<string, string>()).toEqual({ tag: "idle" });
    expect(loadingState<string, string>()).toEqual({ tag: "loading" });
    expect(readyState("x")).toEqual({ tag: "ready", value: "x" });
    expect(emptyState(some("r"))).toEqual({ tag: "empty", reason: some("r") });
    expect(emptyState()).toEqual({ tag: "empty", reason: none() });
    expect(errorState("e")).toEqual({ tag: "error", error: "e" });
  });
});
