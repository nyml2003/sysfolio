import type { ArticleDocument, ContentNode } from "@/entities/content";
import { formatDate } from "@/shared/lib/date/format-date";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import { unwrapOr } from "@/shared/lib/monads/option";
import { usePreferences } from "@/shared/store/preferences/PreferencesProvider";
import buttonStyles from "@/shared/ui/primitives/Button.module.css";

import styles from "./ArticleView.module.css";

type ArticleViewProps = {
  node: ContentNode;
  document: ArticleDocument;
  restoreNoticeVisible: boolean;
  scrollToTop: () => void;
};

function renderHeading(level: 2 | 3 | 4, id: string, title: string) {
  if (level === 3) {
    return (
      <h3 data-toc-id={id} id={id}>
        {title}
      </h3>
    );
  }

  if (level === 4) {
    return (
      <h4 data-toc-id={id} id={id}>
        {title}
      </h4>
    );
  }

  return (
    <h2 data-toc-id={id} id={id}>
      {title}
    </h2>
  );
}

export function ArticleView({
  node,
  document,
  restoreNoticeVisible,
  scrollToTop,
}: ArticleViewProps) {
  const { locale } = usePreferences();
  const copy = useUiCopy();
  const updatedAt = unwrapOr(node.updatedAt, "");
  const publishedAt = unwrapOr(node.publishedAt, "");
  const readingMinutes = unwrapOr(node.readingMinutes, 0);

  return (
    <article className={styles.root}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>{document.eyebrow}</div>
          <h1 className={styles.title}>{document.title}</h1>
          <div className={styles.meta}>
            {publishedAt === "" ? null : (
              <span>{copy.article.publishedAt(formatDate(publishedAt, locale))}</span>
            )}
            {updatedAt === "" ? null : (
              <span>{copy.article.updatedAt(formatDate(updatedAt, locale))}</span>
            )}
            {readingMinutes === 0 ? null : <span>{copy.common.minuteCount(readingMinutes)}</span>}
          </div>
          <div className={styles.summary}>{document.summary}</div>
        </header>
        {restoreNoticeVisible ? (
          <div className={styles.progressNotice}>
            <span>{copy.article.restoreNotice}</span>
            <button
              className={[buttonStyles.root, buttonStyles.secondary].join(" ")}
              onClick={scrollToTop}
              type="button"
            >
              {copy.article.scrollToTop}
            </button>
          </div>
        ) : null}
        <div className={styles.body} data-article-body="true">
          {document.sections.map((section) => (
            <section key={section.id}>
              {renderHeading(section.level, section.id, section.title)}
              {section.paragraphs.map((paragraph) => (
                <p key={`${section.id}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
