import { startTransition, useCallback, useState } from 'react';

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

export function FileTree({ currentPath, onNavigate }: FileTreeProps) {
  const [scrollElement, setScrollElement] = useState<Option<HTMLDivElement>>(none());
  const copy = useUiCopy();
  const { rows, rootState, loadingNodeIds, expandedIds, toggleNode } = useFileTree(currentPath);
  const registerScrollElement = useCallback((node: HTMLDivElement | null) => {
    setScrollElement((currentElement) => toStableElementOption(currentElement, node));
  }, []);
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => FILE_TREE_ROW_HEIGHT,
    getScrollElement: () => (isSome(scrollElement) ? scrollElement.value : null),
    overscan: FILE_TREE_OVERSCAN,
  });

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
        ref={registerScrollElement}
      >
        <div
          className="sf-file-tree__viewport"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const nodePath = getNodePath(row.node);
            const isFolder = row.node.kind === 'folder';
            const isLoading = loadingNodeIds.includes(row.node.id);
            const showDisclosure = isFolder && row.node.hasChildren;
            const isExpanded = row.isExpanded || expandedIds.includes(row.node.id);

            return (
              <div
                className={[
                  'sf-file-tree__row',
                  row.isSelected ? 'is-selected' : '',
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
                  className="sf-file-tree__label"
                  onClick={() => {
                    startTransition(() => {
                      onNavigate(nodePath);
                    });
                  }}
                >
                  {row.node.title}
                </ButtonGhostMd>
                {row.node.status === 'coming_soon' ? (
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
