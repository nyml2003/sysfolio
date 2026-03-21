import "./FileTree.module.css";

import { startTransition, useRef } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import type { ContentNode } from "@/entities/content";
import { ROOT_PATH, pathFromSegments } from "@/shared/lib/path/content-path";
import {
  ArticleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FolderIcon,
  GameIcon,
  HomeIcon,
  MediaIcon,
  iconStyle,
} from "@/shared/ui/primitives/Icon";

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
  const { rows, rootState, loadingNodeIds, expandedIds, toggleNode } = useFileTree(currentPath);
  const virtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 36,
    getScrollElement: () => parentRef.current,
    overscan: 10,
  });

  return (
    <aside className="m-file-tree" aria-label="文件树">
      <div className="m-file-tree__title">Filesystem</div>
      {rootState.tag === "error" ? (
        <div className="m-file-tree__status">{rootState.error.message}</div>
      ) : null}
      {rootState.tag === "loading" ? (
        <div className="m-file-tree__status">正在展开目录视图…</div>
      ) : null}
      <div className="m-file-tree__list" ref={parentRef}>
        <div
          className="m-file-tree__viewport"
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
                className={[
                  "m-file-node",
                  row.isSelected ? "is-selected" : "",
                  row.node.status !== "available" ? "is-muted" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                data-depth={row.depth}
                key={row.node.id}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <button
                  className="m-file-node__trigger"
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
                  className="m-file-node__label"
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
                  <span className="m-file-node__status" />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
