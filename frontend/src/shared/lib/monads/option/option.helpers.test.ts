import { describe, expect, it } from "vitest";

import {
  flatMap,
  fromNullable,
  isNone,
  isSome,
  map,
  match,
  none,
  orElse,
  some,
  unwrapOr,
} from "./option.helpers";

describe("option.helpers", () => {
  it("normalizes nullish values at boundaries", () => {
    expect(isNone(fromNullable(null))).toBe(true);
    expect(isNone(fromNullable(undefined))).toBe(true);
    expect(isSome(fromNullable("sysfolio"))).toBe(true);
  });

  it("keeps business branching inside helpers", () => {
    const resolvedTitle = match(
      some("Archive"),
      () => "fallback",
      (value) => value,
    );

    expect(resolvedTitle).toBe("Archive");
    expect(unwrapOr(none(), "fallback")).toBe("fallback");
  });

  it("maps and flatMaps", () => {
    expect(map(some(2), (n) => n + 1)).toEqual(some(3));
    expect(map(none(), (n: number) => n)).toEqual(none());
    expect(flatMap(some(1), (n) => some(n + 1))).toEqual(some(2));
    expect(flatMap(some(1), () => none())).toEqual(none());
  });

  it("orElse picks fallback when none", () => {
    expect(orElse(none(), some(2))).toEqual(some(2));
    expect(orElse(some(1), some(2))).toEqual(some(1));
  });

  it("isNone is inverse of isSome", () => {
    expect(isNone(none())).toBe(true);
    expect(isNone(some(1))).toBe(false);
  });
});
