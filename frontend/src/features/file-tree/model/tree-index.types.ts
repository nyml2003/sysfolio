import type { ContentNode, NodeId } from '@/entities/content';

export type TreeIndex = {
  rootId: NodeId;
  nodesById: Record<NodeId, ContentNode>;
  childrenByParentId: Record<NodeId, NodeId[]>;
};
