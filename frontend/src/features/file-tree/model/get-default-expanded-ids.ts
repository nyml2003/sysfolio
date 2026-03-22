import type { NodeId } from "@/entities/content";

import type { TreeIndex } from "./tree-index.types";

export function getDefaultExpandedIds(index: TreeIndex): NodeId[] {
  const topLevelIds = index.childrenByParentId[index.rootId] ?? [];

  return [index.rootId, ...topLevelIds.filter((nodeId) => index.nodesById[nodeId]?.kind === "folder")];
}
