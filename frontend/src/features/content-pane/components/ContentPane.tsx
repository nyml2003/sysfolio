import type { RefObject } from "react";

import type { ContextInfo, RenderableEntryPayload, RepositoryError } from "@/entities/content";
import { ArticleView } from "@/features/article/components/ArticleView";
import { HomeView } from "@/features/home/components/HomeView";
import { none, unwrapOr } from "@/shared/lib/monads/option";
import { ROOT_PATH } from "@/shared/lib/path/content-path";
import type { ResourceState } from "@/shared/lib/resource/resource-state";
import buttonStyles from "@/shared/ui/primitives/Button.module.css";
import { ArticleIcon, FolderIcon, GameIcon, MediaIcon } from "@/shared/ui/primitives/Icon";

import styles from "./ContentPane.module.css";

type ContentPaneProps = {
  path: string;
  resource: ResourceState<RenderableEntryPayload, RepositoryError>;
  scrollContainerRef: RefObject<HTMLElement | null>;
  onNavigate: (path: string) => void;
  onActiveHeadingChange: (headingId: string) => void;
};

function renderDirectoryIcon(kind: string) {
  if (kind === "folder") {
    return <FolderIcon size={16} />;
  }

  if (kind === "game") {
    return <GameIcon size={16} />;
  }

  if (kind === "media") {
    return <MediaIcon size={16} />;
  }

  return <ArticleIcon size={16} />;
}

function renderDirectoryView(payload: RenderableEntryPayload, onNavigate: (path: string) => void) {
  if (payload.content.kind !== "directory") {
    return null;
  }

  return (
    <section className={styles.directoryRoot}>
      <header className={styles.directoryHeader}>
        <div className={styles.directoryEyebrow}>
          {payload.node.pathSegments.join(" / ") || "root"}
        </div>
        <h1 className={styles.directoryTitle}>{payload.content.title}</h1>
        {unwrapOr(payload.content.description, "") === "" ? null : (
          <div className={styles.directorySummary}>
            {unwrapOr(payload.content.description, "")}
          </div>
        )}
      </header>
      <div className={styles.directoryMeta}>
        <span>{payload.content.children.length} items</span>
        <span>目录和文章共用统一内容壳</span>
      </div>
      <div className={styles.directoryList}>
        {payload.content.children.map((entry) => (
          <button
            className={[
              styles.directoryEntry,
              entry.status === "coming_soon" ? styles.directoryEntryComingSoon : "",
            ]
              .filter(Boolean)
              .join(" ")}
            key={entry.id}
            onClick={() => {
              onNavigate(entry.path);
            }}
            type="button"
          >
            {renderDirectoryIcon(entry.kind)}
            <div className={styles.directoryEntryBody}>
              <div className={styles.directoryEntryTitle}>{entry.title}</div>
              <div className={styles.directoryEntryMeta}>
                <span>{entry.kind === "folder" ? "目录" : entry.kind}</span>
                {entry.readingMinutes.tag === "some" ? (
                  <span>{entry.readingMinutes.value} min</span>
                ) : null}
              </div>
              {unwrapOr(entry.description, "") === "" ? null : (
                <div className={styles.directoryEntrySummary}>
                  {unwrapOr(entry.description, "")}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function renderUnsupportedState(context: ContextInfo, onNavigate: (path: string) => void) {
  const fallbackPath =
    context.parent.tag === "some"
      ? context.parent.value.path
      : context.breadcrumbs.length > 0
        ? context.breadcrumbs[0].path
        : ROOT_PATH;

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>正在搭建当前视图</h2>
          <p>
            这条路径已经进入统一 repository，但当前类型还没有正文阅读器。你可以先返回父级目录继续浏览。
          </p>
          <button
            className={[buttonStyles.root, buttonStyles.secondary].join(" ")}
            onClick={() => {
              onNavigate(fallbackPath);
            }}
            type="button"
          >
            返回上一级
          </button>
        </div>
      </div>
    </section>
  );
}

function renderStatusState(title: string, message: string) {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>{title}</h2>
          <p>{message}</p>
        </div>
      </div>
    </section>
  );
}

export function ContentPane({
  path,
  resource,
  scrollContainerRef,
  onNavigate,
  onActiveHeadingChange,
}: ContentPaneProps) {
  if (resource.tag === "loading" || resource.tag === "idle") {
    return renderStatusState(
      "正在读取内容",
      "路径已经解析完成，当前正在从 repository 聚合渲染所需内容。",
    );
  }

  if (resource.tag === "error") {
    return renderStatusState("路径未命中", resource.error.message);
  }

  if (resource.tag === "empty") {
    return renderStatusState(
      "当前内容为空",
      unwrapOr(resource.reason, "这条路径暂时没有可渲染内容。"),
    );
  }

  const context = unwrapOr(resource.value.context, {
    breadcrumbs: [],
    parent: none(),
    siblings: [],
    recentEntries: [],
    stats: none(),
  });

  if (resource.value.content.kind === "home") {
    return (
      <HomeView content={resource.value.content} context={context} onNavigate={onNavigate} />
    );
  }

  if (resource.value.content.kind === "directory") {
    return renderDirectoryView(resource.value, onNavigate);
  }

  if (resource.value.content.kind === "article") {
    return (
      <ArticleView
        document={resource.value.content}
        node={resource.value.node}
        onActiveHeadingChange={onActiveHeadingChange}
        path={path}
        scrollContainerRef={scrollContainerRef}
      />
    );
  }

  return renderUnsupportedState(context, onNavigate);
}
