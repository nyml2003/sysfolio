import type { RenderableEntryPayload, RepositoryError } from "@/entities/content";
import { none, unwrapOr } from "@/shared/lib/monads/option";
import type { ResourceState } from "@/shared/lib/resource/resource-state";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import buttonStyles from "@/shared/ui/primitives/Button.module.css";

import styles from "./ContextPanel.module.css";

type ContextPanelProps = {
  resource: ResourceState<RenderableEntryPayload, RepositoryError>;
  activeHeadingId: string;
  onNavigate: (path: string) => void;
  onScrollToHeading: (headingId: string) => void;
};

export function ContextPanel({
  resource,
  activeHeadingId,
  onNavigate,
  onScrollToHeading,
}: ContextPanelProps) {
  const copy = useUiCopy();

  if (resource.tag !== "ready") {
    return (
      <aside className={styles.root}>
        <section className={styles.section}>
          <div className={styles.title}>{copy.contextPanel.placeholderTitle}</div>
          <div>{copy.contextPanel.placeholderBody}</div>
        </section>
      </aside>
    );
  }

  const context = unwrapOr(resource.value.context, {
    breadcrumbs: [],
    parent: none(),
    siblings: [],
    recentEntries: [],
    stats: none(),
  });
  const parentEntry = context.parent.tag === "some" ? context.parent.value : null;

  return (
    <aside className={styles.root}>
      {resource.value.content.kind === "article" ? (
        <section className={styles.section}>
          <div className={styles.title}>{copy.contextPanel.tocTitle}</div>
          <div className={styles.toc}>
            {resource.value.content.toc.map((item) => (
              <button
                className={[
                  styles.tocItem,
                  item.id === activeHeadingId ? styles.tocItemActive : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                key={item.id}
                onClick={() => {
                  onScrollToHeading(item.id);
                }}
                type="button"
              >
                {item.title}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {context.stats.tag === "some" ? (
        <section className={styles.section}>
          <div className={styles.title}>{copy.contextPanel.directoryStatsTitle}</div>
          <div>{copy.common.itemCount(context.stats.value.childCount)}</div>
          <div>{copy.common.folderCount(context.stats.value.folderCount)}</div>
          <div>{copy.common.articleCount(context.stats.value.articleCount)}</div>
        </section>
      ) : null}

      {parentEntry === null ? null : (
        <section className={styles.section}>
          <div className={styles.title}>{copy.contextPanel.parentTitle}</div>
          <button
            className={[buttonStyles.root, buttonStyles.secondary].join(" ")}
            onClick={() => {
              onNavigate(parentEntry.path);
            }}
            type="button"
          >
            {copy.contextPanel.backTo(parentEntry.title)}
          </button>
        </section>
      )}

      {context.recentEntries.length > 0 ? (
        <section className={styles.section}>
          <div className={styles.title}>{copy.contextPanel.recentTitle}</div>
          {context.recentEntries.map((entry) => (
            <button
              className={styles.tocItem}
              key={entry.id}
              onClick={() => {
                onNavigate(entry.path);
              }}
              type="button"
            >
              {entry.title}
            </button>
          ))}
        </section>
      ) : null}
    </aside>
  );
}
