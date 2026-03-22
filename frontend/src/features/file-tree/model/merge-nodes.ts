import type { ContentNode } from '@/entities/content';
import { isSome } from '@/shared/lib/monads/option';

import type { TreeIndex } from './tree-index.types';

export function mergeNodes(index: TreeIndex, nodes: ContentNode[]): TreeIndex {
  const nextNodesById = { ...index.nodesById };
  const nextChildrenByParentId = { ...index.childrenByParentId };

  for (const node of nodes) {
    nextNodesById[node.id] = node;

    if (isSome(node.parentId)) {
      const parentId = node.parentId.value;
      const nextChildIds = [...(nextChildrenByParentId[parentId] ?? [])];

      if (!nextChildIds.includes(node.id)) {
        nextChildIds.push(node.id);
      }

      nextChildrenByParentId[parentId] = nextChildIds;
    }
  }

  return {
    rootId: index.rootId,
    nodesById: nextNodesById,
    childrenByParentId: nextChildrenByParentId,
  };
}
