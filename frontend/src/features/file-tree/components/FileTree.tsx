import { startTransition, useRef } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import type { ContentNode } from "@/entities/content";
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
      ? "var(--sys-color-text-muted)"
      : "var(--sys-color-icon-default)";

  if (node.kind === "home") {
    return <HomeIcon size={14} style={iconStyle(color)} />;
  }

  if (node.kind === "folder") {
    return <FolderIcon size={14} style={iconStyle(color)} />;
  }

  if (node.kind === "game") {
    return <GameIcon size={14} style={iconStyle(color)} />;
  }

  if (node.kind === "media") {
    return <MediaIcon size={14} style={iconStyle(color)} />;
  }

  return <ArticleIcon size={14} style={iconStyle(color)} />;
}

export function FileTree({ currentPath, onNavigate }: FileTreeProps) {
  const parentRef = useRef<HTMLDivElement | null>(null);
  const copy = useUiCopy();
  const { rows, rootState, loadingNodeIds, expandedIds, toggleNode } = useFileTree(currentPath);
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 36,
    getScrollElement: () => parentRef.current,
    overscan: 10,
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
      <div className={styles.list} ref={parentRef}>
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
                    row.isExpanded || expandedIds.includes(row.node.id) ? (
                      <ChevronDownIcon size={12} />
                    ) : (
                      <ChevronRightIcon size={12} />
                    )
                  ) : null}
                </button>
                {renderNodeIcon(row.node)}
                <button
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
