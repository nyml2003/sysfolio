import { describe, expect, it } from "vitest";

import {
  ROOT_PATH,
  isRootPath,
  normalizePath,
  pathFromSegments,
  splitPathSegments,
} from "./content-path";

describe("content-path", () => {
  describe("normalizePath", () => {
    it("treats empty and whitespace as root", () => {
      expect(normalizePath("")).toBe(ROOT_PATH);
      expect(normalizePath("   ")).toBe(ROOT_PATH);
    });

    it("adds leading slash and trims trailing slashes", () => {
      expect(normalizePath("foo/bar")).toBe("/foo/bar");
      expect(normalizePath("/foo/bar///")).toBe("/foo/bar");
    });

    it("returns root for bare slash", () => {
      expect(normalizePath("/")).toBe(ROOT_PATH);
    });
  });

  describe("splitPathSegments", () => {
    it("returns empty array for root", () => {
      expect(splitPathSegments("/")).toEqual([]);
      expect(splitPathSegments("")).toEqual([]);
    });

    it("splits segments without leading slash pollution", () => {
      expect(splitPathSegments("/a/b")).toEqual(["a", "b"]);
    });
  });

  describe("pathFromSegments", () => {
    it("returns root for empty segments", () => {
      expect(pathFromSegments([])).toBe(ROOT_PATH);
    });

    it("joins segments", () => {
      expect(pathFromSegments(["x", "y"])).toBe("/x/y");
    });
  });

  describe("isRootPath", () => {
    it("detects root", () => {
      expect(isRootPath("/")).toBe(true);
      expect(isRootPath("/a")).toBe(false);
    });
  });
});
