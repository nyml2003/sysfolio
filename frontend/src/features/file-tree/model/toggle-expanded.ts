import type { NodeId } from '@/entities/content';

export function toggleExpanded(currentIds: NodeId[], nodeId: NodeId): NodeId[] {
  return currentIds.includes(nodeId)
    ? currentIds.filter((id) => id !== nodeId)
    : [...currentIds, nodeId];
}
