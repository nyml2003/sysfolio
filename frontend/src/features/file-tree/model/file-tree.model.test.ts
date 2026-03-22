import { describe, expect, it } from "vitest";

import { createMockContentFixtures, ROOT_NODE_ID } from "@/shared/data/mock/content.fixtures";

import {
  buildVisibleRows,
  createTreeIndex,
  getDefaultExpandedIds,
  mergeExpandedIds,
  mergeNodes,
  toggleExpanded,
} from ".";

function createTreePayload() {
  const fixtures = createMockContentFixtures("en-US");

  return {
    rootId: ROOT_NODE_ID,
    nodes: fixtures.contentNodes,
  };
}

describe("file-tree.model", () => {
  it("shows only the first two levels by default and reveals deeper nodes on demand", () => {
    const index = createTreeIndex(createTreePayload());
    const defaultExpandedIds = getDefaultExpandedIds(index);
    const defaultRows = buildVisibleRows(index, defaultExpandedIds, "/primitives");

    expect(defaultRows.some((row) => row.node.id === "primitives-actions")).toBe(true);
    expect(defaultRows.some((row) => row.node.id === "article-button")).toBe(false);

    const expandedRows = buildVisibleRows(
      index,
      toggleExpanded(defaultExpandedIds, "primitives-actions"),
      "/primitives/actions/button",
    );

    expect(expandedRows.some((row) => row.node.id === "article-button")).toBe(true);
    expect(
      expandedRows.some(
        (row) => row.node.id === "article-button" && row.isSelected,
      ),
    ).toBe(true);
  });

  it("merges lazily loaded children without duplicating ids", () => {
    const payload = createTreePayload();
    const initialIndex = createTreeIndex({
      rootId: payload.rootId,
      nodes: payload.nodes.filter((node) =>
        node.id === ROOT_NODE_ID ||
        node.id === "primitives" ||
        node.id === "foundation",
      ),
    });
    const loadedNodes = payload.nodes.filter(
      (node) => node.parentId.tag === "some" && node.parentId.value === "primitives",
    );
    const mergedIndex = mergeNodes(initialIndex, loadedNodes);
    const mergedAgain = mergeNodes(mergedIndex, loadedNodes);

    expect(mergedAgain.childrenByParentId.primitives).toEqual([
      "primitives-actions",
      "primitives-data-entry",
    ]);
  });

  it("mergeExpandedIds appends without duplicates", () => {
    expect(mergeExpandedIds(["a"], ["b", "a"])).toEqual(["a", "b"]);
  });

  it("toggleExpanded removes when already expanded", () => {
    expect(toggleExpanded(["x", "y"], "x")).toEqual(["y"]);
  });

  it("buildVisibleRows marks root path selection", () => {
    const index = createTreeIndex(createTreePayload());
    const expanded = getDefaultExpandedIds(index);
    const rows = buildVisibleRows(index, expanded, "/");

    expect(rows.some((row) => row.isSelected && row.node.kind === "home")).toBe(true);
  });
});
