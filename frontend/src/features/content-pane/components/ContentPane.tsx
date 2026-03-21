import "./ContentPane.module.css";
import "@/shared/ui/primitives/Button.module.css";

import type { RefObject } from "react";

import type { ContextInfo, RenderableEntryPayload, RepositoryError } from "@/entities/content";
import { ArticleView } from "@/features/article/components/ArticleView";
import { HomeView } from "@/features/home/components/HomeView";
import { none, unwrapOr } from "@/shared/lib/monads/option";
import { ROOT_PATH } from "@/shared/lib/path/content-path";
import type { ResourceState } from "@/shared/lib/resource/resource-state";
import { ArticleIcon, FolderIcon, GameIcon, MediaIcon } from "@/shared/ui/primitives/Icon";

type ContentPaneProps = {
  path: string;
  resource: ResourceState<RenderableEntryPayload, RepositoryError>;
  scrollContainerRef: RefObject<HTMLElement>;
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
    <section className="m-directory-view">
      <header className="m-directory-view__header">
        <div className="m-directory-view__eyebrow">
          {payload.node.pathSegments.join(" / ") || "root"}
        </div>
        <h1 className="m-directory-view__title">{payload.content.title}</h1>
        {unwrapOr(payload.content.description, "") === "" ? null : (
          <div className="m-directory-view__summary">
            {unwrapOr(payload.content.description, "")}
          </div>
        )}
      </header>
      <div className="m-directory-view__meta">
        <span>{payload.content.children.length} items</span>
        <span>目录和文章共用统一内容壳</span>
      </div>
      <div className="m-directory-view__list">
        {payload.content.children.map((entry) => (
          <button
            className={[
              "m-directory-entry",
              entry.status === "coming_soon" ? "is-coming-soon" : "",
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
            <div className="m-directory-entry__body">
              <div className="m-directory-entry__title">{entry.title}</div>
              <div className="m-directory-entry__meta">
                <span>{entry.kind === "folder" ? "目录" : entry.kind}</span>
                {entry.readingMinutes.tag === "some" ? (
                  <span>{entry.readingMinutes.value} min</span>
                ) : null}
              </div>
              {unwrapOr(entry.description, "") === "" ? null : (
                <div className="m-directory-entry__summary">
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

function renderFallbackContext(context: ContextInfo, onNavigate: (path: string) => void) {
  const fallbackPath =
    context.parent.tag === "some"
      ? context.parent.value.path
      : context.breadcrumbs.length > 0
        ? context.breadcrumbs[0].path
        : ROOT_PATH;

  return (
    <section className="m-content-pane">
      <div className="m-content-pane__inner">
        <div className="m-empty-state">
          <h2 className="m-empty-state__title">正在搭建当前视图</h2>
          <p>
            这条路径已经进入统一 repository，但当前类型还没有正文阅读器。你可以先返回父级目录继续浏览。
          </p>
          <button
            className="m-button m-button--secondary"
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

export function ContentPane({
  path,
  resource,
  scrollContainerRef,
  onNavigate,
  onActiveHeadingChange,
}: ContentPaneProps) {
  if (resource.tag === "loading" || resource.tag === "idle") {
    return (
      <section className="m-content-pane">
        <div className="m-content-pane__inner">
          <div className="m-empty-state">
            <h2 className="m-empty-state__title">正在读取内容</h2>
            <p>路径已经解析完成，当前正在从 repository 聚合渲染所需内容。</p>
          </div>
        </div>
      </section>
    );
  }

  if (resource.tag === "error") {
    return (
      <section className="m-content-pane">
        <div className="m-content-pane__inner">
          <div className="m-empty-state">
            <h2 className="m-empty-state__title">路径未命中</h2>
            <p>{resource.error.message}</p>
          </div>
        </div>
      </section>
    );
  }

  if (resource.tag === "empty") {
    return (
      <section className="m-content-pane">
        <div className="m-content-pane__inner">
          <div className="m-empty-state">
            <h2 className="m-empty-state__title">当前内容为空</h2>
            <p>{unwrapOr(resource.reason, "这条路径暂时没有可渲染内容。")}</p>
          </div>
        </div>
      </section>
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

  return renderFallbackContext(context, onNavigate);
}
