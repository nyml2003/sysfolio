import { describe, expect, it } from "vitest";

import {
  andThen,
  err,
  fromThrowable,
  isErr,
  isOk,
  map,
  mapErr,
  match,
  ok,
  tryCatch,
  unwrapOr,
} from "./index";

describe("result.helpers", () => {
  it("constructs and narrows ok/err", () => {
    const success = ok(1);
    const failure = err("bad");
    expect(isOk(success)).toBe(true);
    expect(isErr(failure)).toBe(true);
  });

  it("maps ok branch", () => {
    expect(map(ok(2), (n) => n * 2)).toEqual(ok(4));
    expect(map(err("e"), (n: number) => n)).toEqual(err("e"));
  });

  it("maps err branch", () => {
    expect(mapErr(err(1), (e) => String(e))).toEqual(err("1"));
    expect(mapErr(ok(1), (e: number) => e)).toEqual(ok(1));
  });

  it("chains with andThen", () => {
    expect(andThen(ok(1), (n) => ok(n + 1))).toEqual(ok(2));
    expect(andThen(err("e"), () => ok(1))).toEqual(err("e"));
  });

  it("matches both sides", () => {
    expect(
      match(
        ok(3),
        () => "err",
        (v) => `ok:${v}`,
      ),
    ).toBe("ok:3");
    expect(
      match(
        err("e"),
        (e) => `err:${e}`,
        () => "ok",
      ),
    ).toBe("err:e");
  });

  it("unwrapOr", () => {
    expect(unwrapOr(ok(1), 0)).toBe(1);
    expect(unwrapOr(err("e"), 0)).toBe(0);
  });

  it("fromThrowable catches", () => {
    expect(fromThrowable(() => 1)).toEqual(ok(1));
    const r = fromThrowable(() => {
      throw new Error("x");
    });
    expect(isErr(r)).toBe(true);
  });

  it("tryCatch maps error", () => {
    expect(
      tryCatch(
        () => {
          throw new Error("a");
        },
        () => "mapped",
      ),
    ).toEqual(err("mapped"));
    expect(tryCatch(() => 7, () => "mapped")).toEqual(ok(7));
  });
});
