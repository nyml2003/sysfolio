import type { RefObject } from "react";

import type { ArticleDocument, ContentNode } from "@/entities/content";
import { formatDate } from "@/shared/lib/date/format-date";
import { unwrapOr } from "@/shared/lib/monads/option";
import buttonStyles from "@/shared/ui/primitives/Button.module.css";

import { useArticleReading } from "../hooks/useArticleReading";
import styles from "./ArticleView.module.css";

type ArticleViewProps = {
  path: string;
  node: ContentNode;
  document: ArticleDocument;
  scrollContainerRef: RefObject<HTMLElement | null>;
  onActiveHeadingChange: (headingId: string) => void;
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
  path,
  node,
  document,
  scrollContainerRef,
  onActiveHeadingChange,
}: ArticleViewProps) {
  const { restoreNoticeVisible, scrollToTop } = useArticleReading({
    path,
    document,
    scrollContainerRef,
    onActiveHeadingChange,
  });
  const updatedAt = unwrapOr(node.updatedAt, "");
  const publishedAt = unwrapOr(node.publishedAt, "");
  const readingMinutes = unwrapOr(node.readingMinutes, 0);

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.eyebrow}>{document.eyebrow}</div>
          <h1 className={styles.title}>{document.title}</h1>
          <div className={styles.meta}>
            {publishedAt === "" ? null : <span>发布于 {formatDate(publishedAt)}</span>}
            {updatedAt === "" ? null : <span>更新于 {formatDate(updatedAt)}</span>}
            {readingMinutes === 0 ? null : <span>{readingMinutes} min</span>}
          </div>
          <div className={styles.summary}>{document.summary}</div>
        </header>
        {restoreNoticeVisible ? (
          <div className={styles.progressNotice}>
            <span>已恢复到上次阅读位置。</span>
            <button
              className={[buttonStyles.root, buttonStyles.secondary].join(" ")}
              onClick={scrollToTop}
              type="button"
            >
              回到顶部
            </button>
          </div>
        ) : null}
        <article className={styles.body}>
          {document.sections.map((section) => (
            <section key={section.id}>
              {renderHeading(section.level, section.id, section.title)}
              {section.paragraphs.map((paragraph) => (
                <p key={`${section.id}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </section>
  );
}
