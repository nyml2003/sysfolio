import type { ContentNode, NodeId, TreeRootPayload } from "@/entities/content";
import { isSome } from "@/shared/lib/monads/option";
import { ROOT_PATH, normalizePath, pathFromSegments } from "@/shared/lib/path/content-path";

export type TreeIndex = {
  rootId: NodeId;
  nodesById: Record<NodeId, ContentNode>;
  childrenByParentId: Record<NodeId, NodeId[]>;
};

export type TreeRow = {
  node: ContentNode;
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
};

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

export function getDefaultExpandedIds(index: TreeIndex): NodeId[] {
  const topLevelIds = index.childrenByParentId[index.rootId] ?? [];

  return [index.rootId, ...topLevelIds.filter((nodeId) => index.nodesById[nodeId]?.kind === "folder")];
}

export function mergeExpandedIds(currentIds: NodeId[], nextIds: NodeId[]): NodeId[] {
  const merged = [...currentIds];

  for (const nodeId of nextIds) {
    if (!merged.includes(nodeId)) {
      merged.push(nodeId);
    }
  }

  return merged;
}

export function toggleExpanded(currentIds: NodeId[], nodeId: NodeId): NodeId[] {
  return currentIds.includes(nodeId)
    ? currentIds.filter((id) => id !== nodeId)
    : [...currentIds, nodeId];
}

export function buildVisibleRows(
  index: TreeIndex,
  expandedIds: NodeId[],
  selectedPath: string,
): TreeRow[] {
  const normalizedSelectedPath = normalizePath(selectedPath);
  const rows: TreeRow[] = [];

  function walk(parentId: NodeId, depth: number) {
    const childIds = index.childrenByParentId[parentId] ?? [];

    for (const childId of childIds) {
      const node = index.nodesById[childId];

      if (node === undefined) {
        continue;
      }

      const nodePath = node.kind === "home" ? ROOT_PATH : pathFromSegments(node.pathSegments);
      const isExpanded = expandedIds.includes(node.id);

      rows.push({
        node,
        depth,
        isExpanded,
        isSelected: normalizePath(nodePath) === normalizedSelectedPath,
      });

      if (node.kind === "folder" && isExpanded) {
        walk(node.id, depth + 1);
      }
    }
  }

  walk(index.rootId, 0);

  return rows;
}
