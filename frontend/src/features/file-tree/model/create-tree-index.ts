import type { ContentNode, NodeId, TreeRootPayload } from "@/entities/content";
import { isSome } from "@/shared/lib/monads/option";

import type { TreeIndex } from "./tree-index.types";

export function createTreeIndex(payload: TreeRootPayload): TreeIndex {
  const nodesById: Record<NodeId, ContentNode> = {};
  const childrenByParentId: Record<NodeId, NodeId[]> = {};

  for (const node of payload.nodes) {
    nodesById[node.id] = node;

    if (isSome(node.parentId)) {
      const parentId = node.parentId.value;
      childrenByParentId[parentId] = [...(childrenByParentId[parentId] ?? []), node.id];
    }
  }

  return {
    rootId: payload.rootId,
    nodesById,
    childrenByParentId,
  };
}
