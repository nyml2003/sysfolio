import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useVirtualizer } from '@tanstack/react-virtual';

import type { ContentNode } from '@/entities/content';
import { fromNullable, isSome, none, type Option } from '@/shared/lib/monads/option';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { ROOT_PATH, pathFromSegments } from '@/shared/lib/path/content-path';
import { Stack, Surface } from '@/shared/ui/layout';
import { ButtonGhostMd, Heading, Text } from '@/shared/ui/primitives';
import {
  ArticleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  GameIcon,
  HomeIcon,
  MediaIcon,
} from '@/shared/ui/primitives/Icon';
import { iconStyle } from '@/shared/ui/primitives/Icon.style';

import {
  FILE_TREE_DEFAULT_ICON_COLOR,
  FILE_TREE_DISCLOSURE_ICON_SIZE,
  FILE_TREE_MUTED_ICON_COLOR,
  FILE_TREE_NODE_ICON_SIZE,
  FILE_TREE_OVERSCAN,
  FILE_TREE_ROW_HEIGHT,
} from '../constant';
import { useFileTree } from '../hooks/useFileTree';

type FileTreeProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

export type FileTreeViewProps = Pick<
  ReturnType<typeof useFileTree>,
  | 'expandedIds'
  | 'focusChildNode'
  | 'focusFirstNode'
  | 'focusLastNode'
  | 'focusNextNode'
  | 'focusNode'
  | 'focusParentNode'
  | 'focusPreviousNode'
  | 'focusedNodeId'
  | 'loadingNodeIds'
  | 'nodeErrorsById'
  | 'appendTypeaheadCharacter'
  | 'retryNode'
  | 'rootState'
  | 'rows'
  | 'typeaheadBuffer'
  | 'toggleNode'
> & {
  onNavigate: (path: string) => void;
};

function getNodePath(node: ContentNode): string {
  return node.kind === 'home' ? ROOT_PATH : pathFromSegments(node.pathSegments);
}

function renderNodeIcon(node: ContentNode) {
  const color =
    node.status === 'coming_soon' ? FILE_TREE_MUTED_ICON_COLOR : FILE_TREE_DEFAULT_ICON_COLOR;

  if (node.kind === 'home') {
    return <HomeIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
  }

  if (node.kind === 'folder') {
    return <FolderIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
  }

  if (node.kind === 'game') {
    return <GameIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
  }

  if (node.kind === 'media') {
    return <MediaIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
  }

  return <ArticleIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
}

function toStableElementOption(
  currentElement: Option<HTMLDivElement>,
  nextElement: HTMLDivElement | null
): Option<HTMLDivElement> {
  const nextOption = fromNullable(nextElement);

  if (!isSome(nextOption)) {
    return isSome(currentElement) ? none() : currentElement;
  }

  if (isSome(currentElement) && currentElement.value === nextOption.value) {
    return currentElement;
  }

  return nextOption;
}

export function FileTreeView({
  appendTypeaheadCharacter,
  expandedIds,
  focusChildNode,
  focusFirstNode,
  focusLastNode,
  focusNextNode,
  focusNode,
  focusParentNode,
  focusPreviousNode,
  focusedNodeId,
  loadingNodeIds,
  nodeErrorsById,
  onNavigate,
  retryNode,
  rootState,
  rows,
  typeaheadBuffer,
  toggleNode,
}: FileTreeViewProps) {
  const [scrollElement, setScrollElement] = useState<Option<HTMLDivElement>>(none());
  const rowButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const copy = useUiCopy();
  const registerScrollElement = useCallback((node: HTMLDivElement | null) => {
    setScrollElement((currentElement) => toStableElementOption(currentElement, node));
  }, []);
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => FILE_TREE_ROW_HEIGHT,
    getScrollElement: () => (isSome(scrollElement) ? scrollElement.value : null),
    overscan: FILE_TREE_OVERSCAN,
  });
  const hasMeasuredViewport = isSome(scrollElement) && scrollElement.value.clientHeight > 0;
  const virtualRows = useMemo(
    () =>
      hasMeasuredViewport
        ? virtualizer.getVirtualItems()
        : rows.map((row, index) => ({
            index,
            key: row.node.id,
            start: index * FILE_TREE_ROW_HEIGHT,
          })),
    [hasMeasuredViewport, rows, virtualizer]
  );
  const totalSize = hasMeasuredViewport
    ? virtualizer.getTotalSize()
    : rows.length * FILE_TREE_ROW_HEIGHT;

  useEffect(() => {
    if (focusedNodeId === '') {
      return;
    }

    const focusedElement = rowButtonRefs.current[focusedNodeId];

    if (focusedElement !== null && focusedElement !== undefined) {
      if (document.activeElement !== focusedElement) {
        focusedElement.focus();
      }

      return;
    }

    const focusedIndex = rows.findIndex((row) => row.node.id === focusedNodeId);

    if (focusedIndex >= 0) {
      virtualizer.scrollToIndex(focusedIndex, {
        align: 'auto',
      });
    }
  }, [focusedNodeId, rows, virtualizer]);

  const registerRowButton = useCallback(
    (nodeId: string, node: HTMLButtonElement | null) => {
      rowButtonRefs.current[nodeId] = node;

      if (node !== null && focusedNodeId === nodeId && document.activeElement !== node) {
        node.focus();
      }
    },
    [focusedNodeId]
  );

  return (
    <Stack as="aside" aria-label={copy.fileTree.ariaLabel} className="sf-file-tree" gap="sm">
      <Heading
        className="sf-file-tree__title"
        level={4}
        leadingIcon={none()}
        tone="muted"
        trailingMeta={none()}
        variant="caption-heading"
      >
        {copy.fileTree.title}
      </Heading>
      {rootState.tag === 'error' ? (
        <Surface tone="danger">
          <Text tone="default" variant="subtle">
            {rootState.error.message}
          </Text>
        </Surface>
      ) : null}
      {rootState.tag === 'loading' ? (
        <Surface tone="muted">
          <Text tone="muted" variant="subtle">
            {copy.fileTree.loading}
          </Text>
        </Surface>
      ) : null}
      <div
        aria-busy={rootState.tag === 'loading' || loadingNodeIds.length > 0}
        className="sf-file-tree__list"
        data-typeahead-buffer={typeaheadBuffer === '' ? undefined : typeaheadBuffer}
        ref={registerScrollElement}
        role="tree"
      >
        <div className="sf-file-tree__viewport" style={{ height: `${totalSize}px` }}>
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index];
            const nodePath = getNodePath(row.node);
            const isFolder = row.node.kind === 'folder';
            const isLoading = loadingNodeIds.includes(row.node.id);
            const nodeError = nodeErrorsById[row.node.id];
            const showDisclosure = isFolder && row.node.hasChildren;
            const isExpanded = row.isExpanded || expandedIds.includes(row.node.id);
            const isFocused = row.node.id === focusedNodeId;

            return (
              <div
                className={[
                  'sf-file-tree__row',
                  isFocused ? 'is-focused' : '',
                  row.isSelected ? 'is-selected' : '',
                  nodeError !== undefined ? 'is-error' : '',
                  row.node.status !== 'available' ? 'is-muted' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={row.node.id}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingInlineStart: `calc(var(--sf-space-3) + ${row.depth} * var(--sf-space-4))`,
                }}
              >
                <ButtonGhostMd
                  {...(showDisclosure
                    ? {
                        'aria-expanded': isExpanded,
                        'aria-label': isExpanded
                          ? copy.fileTree.collapseDirectory(row.node.title)
                          : copy.fileTree.expandDirectory(row.node.title),
                      }
                    : {})}
                  className="sf-file-tree__trigger"
                  disabled={!showDisclosure || isLoading}
                  onClick={() => {
                    if (!showDisclosure) {
                      return;
                    }

                    toggleNode(row.node.id);
                  }}
                  tabIndex={-1}
                >
                  {showDisclosure ? (
                    isExpanded ? (
                      <ChevronDownIcon size={FILE_TREE_DISCLOSURE_ICON_SIZE} />
                    ) : (
                      <ChevronRightIcon size={FILE_TREE_DISCLOSURE_ICON_SIZE} />
                    )
                  ) : (
                    false
                  )}
                </ButtonGhostMd>
                {renderNodeIcon(row.node)}
                <ButtonGhostMd
                  aria-current={row.isSelected ? 'page' : false}
                  aria-expanded={showDisclosure ? isExpanded : undefined}
                  aria-level={row.depth + 1}
                  aria-selected={row.isSelected}
                  className="sf-file-tree__label"
                  onFocus={() => {
                    if (!isFocused) {
                      focusNode(row.node.id);
                    }
                  }}
                  onClick={() => {
                    startTransition(() => {
                      onNavigate(nodePath);
                    });
                  }}
                  onKeyDown={(event) => {
                    if (event.altKey || event.ctrlKey || event.metaKey) {
                      return;
                    }

                    if (event.key === 'ArrowDown') {
                      event.preventDefault();
                      focusNextNode();
                      return;
                    }

                    if (event.key === 'ArrowUp') {
                      event.preventDefault();
                      focusPreviousNode();
                      return;
                    }

                    if (event.key === 'Home') {
                      event.preventDefault();
                      focusFirstNode();
                      return;
                    }

                    if (event.key === 'End') {
                      event.preventDefault();
                      focusLastNode();
                      return;
                    }

                    if (event.key === 'ArrowLeft') {
                      event.preventDefault();
                      focusParentNode();
                      return;
                    }

                    if (event.key === 'ArrowRight') {
                      event.preventDefault();
                      focusChildNode();
                      return;
                    }

                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      startTransition(() => {
                        onNavigate(nodePath);
                      });
                      return;
                    }

                    if (event.key.length === 1) {
                      appendTypeaheadCharacter(event.key);
                    }
                  }}
                  ref={(node) => {
                    registerRowButton(row.node.id, node);
                  }}
                  role="treeitem"
                  tabIndex={isFocused ? 0 : -1}
                >
                  {row.node.title}
                </ButtonGhostMd>
                {nodeError !== undefined ? (
                  <button
                    aria-label={copy.fileTree.retryDirectoryLoad(row.node.title)}
                    className="sf-file-tree__retry-button"
                    onClick={() => {
                      retryNode(row.node.id);
                    }}
                    title={nodeError.message}
                    type="button"
                  >
                    {copy.fileTree.retryButton}
                  </button>
                ) : row.node.status === 'coming_soon' ? (
                  <span className="sf-file-tree__status-dot" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </Stack>
  );
}

export function FileTree({ currentPath, onNavigate }: FileTreeProps) {
  const tree = useFileTree(currentPath);

  return <FileTreeView {...tree} onNavigate={onNavigate} />;
}
