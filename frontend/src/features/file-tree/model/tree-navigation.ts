import type { NodeId } from '@/entities/content';
import type { AppLocale } from '@/shared/lib/i18n/locale.types';

import type { TreeRow } from './tree-row.types';

function normalizeTitle(title: string, locale: AppLocale): string {
  return title.trim().toLocaleLowerCase(locale);
}

export function getRowIndex(rows: TreeRow[], nodeId: NodeId): number {
  return rows.findIndex((row) => row.node.id === nodeId);
}

export function getFirstRowId(rows: TreeRow[]): NodeId {
  return rows[0]?.node.id ?? '';
}

export function getLastRowId(rows: TreeRow[]): NodeId {
  return rows.at(-1)?.node.id ?? '';
}

export function getSelectedOrFirstRowId(rows: TreeRow[]): NodeId {
  return rows.find((row) => row.isSelected)?.node.id ?? getFirstRowId(rows);
}

export function getNextRowId(rows: TreeRow[], focusedNodeId: NodeId): NodeId {
  const currentIndex = getRowIndex(rows, focusedNodeId);

  if (currentIndex < 0) {
    return getSelectedOrFirstRowId(rows);
  }

  return rows[currentIndex + 1]?.node.id ?? rows[currentIndex]?.node.id ?? '';
}

export function getPreviousRowId(rows: TreeRow[], focusedNodeId: NodeId): NodeId {
  const currentIndex = getRowIndex(rows, focusedNodeId);

  if (currentIndex < 0) {
    return getSelectedOrFirstRowId(rows);
  }

  return rows[currentIndex - 1]?.node.id ?? rows[currentIndex]?.node.id ?? '';
}

export function getParentRowId(rows: TreeRow[], focusedNodeId: NodeId): NodeId {
  const currentRow = rows.find((row) => row.node.id === focusedNodeId);
  const parentNodeId = currentRow?.node.ancestorIds.at(-1) ?? '';

  return parentNodeId === '' ? focusedNodeId : parentNodeId;
}

export function getFirstChildRowId(rows: TreeRow[], focusedNodeId: NodeId): NodeId {
  const currentIndex = getRowIndex(rows, focusedNodeId);
  const currentRow = currentIndex < 0 ? undefined : rows[currentIndex];
  const nextRow = currentIndex < 0 ? undefined : rows[currentIndex + 1];

  if (currentRow === undefined || nextRow === undefined || nextRow.depth !== currentRow.depth + 1) {
    return focusedNodeId;
  }

  return nextRow.node.id;
}

export function resolveTypeaheadMatch(
  rows: TreeRow[],
  query: string,
  focusedNodeId: NodeId,
  locale: AppLocale
): NodeId {
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);

  if (normalizedQuery === '' || rows.length === 0) {
    return '';
  }

  const currentIndex = getRowIndex(rows, focusedNodeId);
  const searchOrder =
    currentIndex < 0 ? rows : [...rows.slice(currentIndex + 1), ...rows.slice(0, currentIndex + 1)];
  const matchedRow = searchOrder.find((row) =>
    normalizeTitle(row.node.title, locale).startsWith(normalizedQuery)
  );

  return matchedRow?.node.id ?? '';
}
