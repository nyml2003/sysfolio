import { describe, expect, it } from "vitest";

import { createMockContentFixtures, ROOT_NODE_ID } from "@/shared/data/mock/content.fixtures";

import {
  buildVisibleRows,
  createTreeIndex,
  getDefaultExpandedIds,
  mergeNodes,
  toggleExpanded,
} from "./file-tree.model";

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
    const defaultRows = buildVisibleRows(index, defaultExpandedIds, "/archive");

    expect(defaultRows.some((row) => row.node.id === "archive-essays")).toBe(true);
    expect(defaultRows.some((row) => row.node.id === "article-filesystem-reading")).toBe(false);

    const expandedRows = buildVisibleRows(
      index,
      toggleExpanded(defaultExpandedIds, "archive-essays"),
      "/archive/essays/filesystem-reading",
    );

    expect(expandedRows.some((row) => row.node.id === "article-filesystem-reading")).toBe(true);
    expect(
      expandedRows.some(
        (row) => row.node.id === "article-filesystem-reading" && row.isSelected,
      ),
    ).toBe(true);
  });

  it("merges lazily loaded children without duplicating ids", () => {
    const payload = createTreePayload();
    const initialIndex = createTreeIndex({
      rootId: payload.rootId,
      nodes: payload.nodes.filter((node) =>
        node.id === ROOT_NODE_ID ||
        node.id === "archive" ||
        node.id === "lab",
      ),
    });
    const loadedNodes = payload.nodes.filter((node) => node.parentId.tag === "some" && node.parentId.value === "archive");
    const mergedIndex = mergeNodes(initialIndex, loadedNodes);
    const mergedAgain = mergeNodes(mergedIndex, loadedNodes);

    expect(mergedAgain.childrenByParentId.archive).toEqual([
      "archive-essays",
      "archive-notes",
      "archive-cabinet",
    ]);
  });
});
