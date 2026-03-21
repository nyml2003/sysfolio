import { describe, expect, it } from "vitest";

import { fromNullable, isNone, isSome, match, none, some, unwrapOr } from "./option.helpers";

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
});
