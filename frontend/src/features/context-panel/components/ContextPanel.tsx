import type {
  DirectoryChildSummary,
  RenderableEntryPayload,
  RepositoryError,
} from '@/entities/content';
import { isSome, none, unwrapOr } from '@/shared/lib/monads/option';
import type { Option } from '@/shared/lib/monads/option';
import type { ResourceState } from '@/shared/lib/resource/resource-state';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { ButtonGhostMd, ButtonSecondaryMd } from '@/shared/ui/primitives';

import styles from './ContextPanel.module.css';

type ContextPanelProps = {
  resource: ResourceState<RenderableEntryPayload, RepositoryError>;
  activeHeadingId: string;
  onNavigate: (path: string) => void;
  onScrollToHeading: (headingId: string) => void;
};

function renderParentSection(
  parent: Option<DirectoryChildSummary>,
  title: string,
  backToLabel: (entryTitle: string) => string,
  onNavigate: (path: string) => void
) {
  if (!isSome(parent)) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.title}>{title}</div>
      <ButtonSecondaryMd
        onClick={() => {
          onNavigate(parent.value.path);
        }}
      >
        {backToLabel(parent.value.title)}
      </ButtonSecondaryMd>
    </section>
  );
}

export function ContextPanel({
  resource,
  activeHeadingId,
  onNavigate,
  onScrollToHeading,
}: ContextPanelProps) {
  const copy = useUiCopy();

  if (resource.tag !== 'ready') {
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
  const parentSection = renderParentSection(
    context.parent,
    copy.contextPanel.parentTitle,
    copy.contextPanel.backTo,
    onNavigate
  );

  return (
    <aside className={styles.root}>
      {resource.value.content.kind === 'article' ? (
        <section className={styles.section}>
          <div className={styles.title}>{copy.contextPanel.tocTitle}</div>
          <div className={styles.toc}>
            {resource.value.content.toc.map((item) => (
              <ButtonGhostMd
                aria-current={item.id === activeHeadingId ? 'location' : false}
                className={[styles.tocItem, item.id === activeHeadingId ? styles.tocItemActive : '']
                  .filter(Boolean)
                  .join(' ')}
                key={item.id}
                onClick={() => {
                  onScrollToHeading(item.id);
                }}
              >
                {item.title}
              </ButtonGhostMd>
            ))}
          </div>
        </section>
      ) : null}

      {isSome(context.stats) ? (
        <section className={styles.section}>
          <div className={styles.title}>{copy.contextPanel.directoryStatsTitle}</div>
          <div>{copy.common.itemCount(context.stats.value.childCount)}</div>
          <div>{copy.common.folderCount(context.stats.value.folderCount)}</div>
          <div>{copy.common.articleCount(context.stats.value.articleCount)}</div>
        </section>
      ) : null}

      {parentSection}

      {context.recentEntries.length > 0 ? (
        <section className={styles.section}>
          <div className={styles.title}>{copy.contextPanel.recentTitle}</div>
          {context.recentEntries.map((entry) => (
            <ButtonGhostMd
              className={styles.tocItem}
              key={entry.id}
              onClick={() => {
                onNavigate(entry.path);
              }}
            >
              {entry.title}
            </ButtonGhostMd>
          ))}
        </section>
      ) : null}
    </aside>
  );
}
