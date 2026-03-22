import type { NodeId } from '@/entities/content';
import { ROOT_PATH, normalizePath, pathFromSegments } from '@/shared/lib/path/content-path';

import type { TreeIndex } from './tree-index.types';
import type { TreeRow } from './tree-row.types';

export function buildVisibleRows(
  index: TreeIndex,
  expandedIds: NodeId[],
  selectedPath: string
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

      const nodePath = node.kind === 'home' ? ROOT_PATH : pathFromSegments(node.pathSegments);
      const isExpanded = expandedIds.includes(node.id);

      rows.push({
        node,
        depth,
        isExpanded,
        isSelected: normalizePath(nodePath) === normalizedSelectedPath,
      });

      if (node.kind === 'folder' && isExpanded) {
        walk(node.id, depth + 1);
      }
    }
  }

  walk(index.rootId, 0);

  return rows;
}
