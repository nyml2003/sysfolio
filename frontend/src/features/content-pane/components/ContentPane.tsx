import type { ContextInfo, RenderableEntryPayload, RepositoryError } from "@/entities/content";
import { ArticleView } from "@/features/article/components/ArticleView";
import { HomeView } from "@/features/home/components/HomeView";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import { isSome, none, unwrapOr } from "@/shared/lib/monads/option";
import { ROOT_PATH } from "@/shared/lib/path/content-path";
import type { ResourceState } from "@/shared/lib/resource/resource-state";
import { ArticleIcon, FolderIcon, GameIcon, MediaIcon } from "@/shared/ui/primitives/Icon";
import { Button } from "@/shared/ui/primitives";

import styles from "./ContentPane.module.css";

type ContentPaneProps = {
  resource: ResourceState<RenderableEntryPayload, RepositoryError>;
  onNavigate: (path: string) => void;
  restoreNoticeVisible: boolean;
  scrollToTop: () => void;
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

function renderDirectoryView(
  payload: RenderableEntryPayload,
  onNavigate: (path: string) => void,
  copy: ReturnType<typeof useUiCopy>,
) {
  if (payload.content.kind !== "directory") {
    return null;
  }

  return (
    <section className={styles.directoryRoot}>
      <header className={styles.directoryHeader}>
        <div className={styles.directoryEyebrow}>
          {payload.node.pathSegments.join(" / ") || copy.common.rootLabel}
        </div>
        <h1 className={styles.directoryTitle}>{payload.content.title}</h1>
        {unwrapOr(payload.content.description, "") === "" ? null : (
          <div className={styles.directorySummary}>
            {unwrapOr(payload.content.description, "")}
          </div>
        )}
      </header>
      <div className={styles.directoryMeta}>
        <span>{copy.common.itemCount(payload.content.children.length)}</span>
        <span>{copy.contentPane.directorySharedMeta}</span>
      </div>
      <div className={styles.directoryList}>
        {payload.content.children.map((entry) => (
          <Button
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
            tone="ghost"
            type="button"
          >
            {renderDirectoryIcon(entry.kind)}
            <div className={styles.directoryEntryBody}>
              <div className={styles.directoryEntryTitle}>{entry.title}</div>
              <div className={styles.directoryEntryMeta}>
                <span>{copy.common.kindLabel(entry.kind)}</span>
                {isSome(entry.readingMinutes) ? (
                  <span>{copy.common.minuteCount(entry.readingMinutes.value)}</span>
                ) : null}
              </div>
              {unwrapOr(entry.description, "") === "" ? null : (
                <div className={styles.directoryEntrySummary}>
                  {unwrapOr(entry.description, "")}
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>
    </section>
  );
}

function renderUnsupportedState(
  context: ContextInfo,
  onNavigate: (path: string) => void,
  copy: ReturnType<typeof useUiCopy>,
) {
  const fallbackPath =
    isSome(context.parent)
      ? context.parent.value.path
      : context.breadcrumbs.length > 0
        ? context.breadcrumbs[0].path
        : ROOT_PATH;

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>{copy.contentPane.unsupportedTitle}</h2>
          <p>{copy.contentPane.unsupportedBody}</p>
          <Button
            onClick={() => {
              onNavigate(fallbackPath);
            }}
            tone="secondary"
            type="button"
          >
            {copy.contentPane.backToParent}
          </Button>
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
  resource,
  onNavigate,
  restoreNoticeVisible,
  scrollToTop,
}: ContentPaneProps) {
  const copy = useUiCopy();

  if (resource.tag === "loading" || resource.tag === "idle") {
    return renderStatusState(
      copy.contentPane.loadingTitle,
      copy.contentPane.loadingBody,
    );
  }

  if (resource.tag === "error") {
    return renderStatusState(copy.contentPane.notFoundTitle, resource.error.message);
  }

  if (resource.tag === "empty") {
    return renderStatusState(
      copy.contentPane.emptyTitle,
      unwrapOr(resource.reason, copy.contentPane.defaultEmptyReason),
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
    return renderDirectoryView(resource.value, onNavigate, copy);
  }

  if (resource.value.content.kind === "article") {
    return (
      <ArticleView
        document={resource.value.content}
        node={resource.value.node}
        restoreNoticeVisible={restoreNoticeVisible}
        scrollToTop={scrollToTop}
      />
    );
  }

  return renderUnsupportedState(context, onNavigate, copy);
}
