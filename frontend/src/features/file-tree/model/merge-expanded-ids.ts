import type { NodeId } from '@/entities/content';

export function mergeExpandedIds(currentIds: NodeId[], nextIds: NodeId[]): NodeId[] {
  const merged = [...currentIds];

  for (const nodeId of nextIds) {
    if (!merged.includes(nodeId)) {
      merged.push(nodeId);
    }
  }

  return merged;
}
