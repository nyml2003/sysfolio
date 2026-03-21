import { startTransition, useCallback, useState } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import type { ContentNode } from "@/entities/content";
import {
  fromNullable,
  isSome,
  none,
  type Option,
} from "@/shared/lib/monads/option";
import { ROOT_PATH, pathFromSegments } from "@/shared/lib/path/content-path";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import {
  ArticleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  GameIcon,
  HomeIcon,
  MediaIcon,
} from "@/shared/ui/primitives/Icon";
import { iconStyle } from "@/shared/ui/primitives/Icon.style";
import styles from "./FileTree.module.css";

import {
  FILE_TREE_DEFAULT_ICON_COLOR,
  FILE_TREE_DISCLOSURE_ICON_SIZE,
  FILE_TREE_MUTED_ICON_COLOR,
  FILE_TREE_NODE_ICON_SIZE,
  FILE_TREE_OVERSCAN,
  FILE_TREE_ROW_HEIGHT,
} from "../constant";
import { useFileTree } from "../hooks/useFileTree";

type FileTreeProps = {
  currentPath: string;
  onNavigate: (path: string) => void;
};

function getNodePath(node: ContentNode): string {
  return node.kind === "home" ? ROOT_PATH : pathFromSegments(node.pathSegments);
}

function renderNodeIcon(node: ContentNode) {
  const color =
    node.status === "coming_soon"
      ? FILE_TREE_MUTED_ICON_COLOR
      : FILE_TREE_DEFAULT_ICON_COLOR;

  if (node.kind === "home") {
    return <HomeIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
  }

  if (node.kind === "folder") {
    return <FolderIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
  }

  if (node.kind === "game") {
    return <GameIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
  }

  if (node.kind === "media") {
    return <MediaIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
  }

  return <ArticleIcon size={FILE_TREE_NODE_ICON_SIZE} style={iconStyle(color)} />;
}

function toStableElementOption(
  currentElement: Option<HTMLDivElement>,
  nextElement: HTMLDivElement | null,
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
    <aside className={styles.root} aria-label={copy.fileTree.ariaLabel}>
      <div className={styles.title}>{copy.fileTree.title}</div>
      {rootState.tag === "error" ? (
        <div className={styles.status}>{rootState.error.message}</div>
      ) : null}
      {rootState.tag === "loading" ? (
        <div className={styles.status}>{copy.fileTree.loading}</div>
      ) : null}
      <div
        aria-busy={rootState.tag === "loading" || loadingNodeIds.length > 0}
        className={styles.list}
        ref={registerScrollElement}
      >
        <div
          className={styles.viewport}
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            const nodePath = getNodePath(row.node);
            const isFolder = row.node.kind === "folder";
            const isLoading = loadingNodeIds.includes(row.node.id);
            const showDisclosure = isFolder && row.node.hasChildren;
            const isExpanded = row.isExpanded || expandedIds.includes(row.node.id);

            return (
              <div
                className={[styles.row, row.isSelected ? styles.selected : "", row.node.status !== "available" ? styles.muted : ""]
                  .filter(Boolean)
                  .join(" ")}
                key={row.node.id}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingInlineStart: `calc(var(--sys-space-8) + ${row.depth} * var(--sys-space-12))`,
                }}
              >
                <button
                  aria-expanded={showDisclosure ? isExpanded : undefined}
                  aria-label={
                    showDisclosure
                      ? isExpanded
                        ? copy.fileTree.collapseDirectory(row.node.title)
                        : copy.fileTree.expandDirectory(row.node.title)
                      : undefined
                  }
                  className={styles.trigger}
                  disabled={!showDisclosure || isLoading}
                  onClick={() => {
                    if (!showDisclosure) {
                      return;
                    }

                    toggleNode(row.node.id);
                  }}
                  type="button"
                >
                  {showDisclosure ? (
                    isExpanded ? (
                      <ChevronDownIcon size={FILE_TREE_DISCLOSURE_ICON_SIZE} />
                    ) : (
                      <ChevronRightIcon size={FILE_TREE_DISCLOSURE_ICON_SIZE} />
                    )
                  ) : null}
                </button>
                {renderNodeIcon(row.node)}
                <button
                  aria-current={row.isSelected ? "page" : false}
                  className={styles.label}
                  onClick={() => {
                    startTransition(() => {
                      onNavigate(nodePath);
                    });
                  }}
                  type="button"
                >
                  {row.node.title}
                </button>
                {row.node.status === "coming_soon" ? (
                  <span className={styles.statusDot} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
