import { useCallback, useEffect, useMemo } from "react";

import type { ArticleDocument, ContentNode } from "@/entities/content";
import { useArticleDom } from "@/features/article/context/article-dom.context";
import { formatDate } from "@/shared/lib/date/format-date";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import { fromNullable, unwrapOr } from "@/shared/lib/monads/option";
import { usePreferences } from "@/shared/store/preferences";
import { Button } from "@/shared/ui/primitives";

import styles from "./ArticleView.module.css";

type ArticleViewProps = {
  node: ContentNode;
  document: ArticleDocument;
  restoreNoticeVisible: boolean;
  scrollToTop: () => void;
};

type ArticleHeadingProps = {
  id: string;
  level: 2 | 3 | 4;
  title: string;
};

function ArticleHeading({ id, level, title }: ArticleHeadingProps) {
  const { registerHeading } = useArticleDom();
  const registerHeadingElement = useCallback(
    (node: HTMLHeadingElement | null) => {
      registerHeading(id, fromNullable(node));
    },
    [id, registerHeading],
  );

  if (level === 3) {
    return (
      <h3 id={id} ref={registerHeadingElement}>
        {title}
      </h3>
    );
  }

  if (level === 4) {
    return (
      <h4 id={id} ref={registerHeadingElement}>
        {title}
      </h4>
    );
  }

  return (
    <h2 id={id} ref={registerHeadingElement}>
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
  const { registerArticleBody, registerBottomSentinel, registerHeadingOrder } = useArticleDom();
  const updatedAt = unwrapOr(node.updatedAt, "");
  const publishedAt = unwrapOr(node.publishedAt, "");
  const readingMinutes = unwrapOr(node.readingMinutes, 0);
  const headingIds = useMemo(
    () => document.sections.map((section) => section.id),
    [document.sections],
  );
  const registerArticleBodyElement = useCallback(
    (node: HTMLDivElement | null) => {
      registerArticleBody(fromNullable(node));
    },
    [registerArticleBody],
  );
  const registerBottomSentinelElement = useCallback(
    (node: HTMLDivElement | null) => {
      registerBottomSentinel(fromNullable(node));
    },
    [registerBottomSentinel],
  );

  useEffect(() => {
    registerHeadingOrder(headingIds);
  }, [headingIds, registerHeadingOrder]);

  useEffect(() => {
    return () => {
      registerHeadingOrder([]);
    };
  }, [registerHeadingOrder]);

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
            <Button onClick={scrollToTop} tone="secondary" type="button">
              {copy.article.scrollToTop}
            </Button>
          </div>
        ) : null}
        <div className={styles.body} ref={registerArticleBodyElement}>
          {document.sections.map((section) => (
            <section key={section.id}>
              <ArticleHeading id={section.id} level={section.level} title={section.title} />
              {section.paragraphs.map((paragraph) => (
                <p key={`${section.id}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
              ))}
            </section>
          ))}
          <div aria-hidden="true" className={styles.bottomSentinel} ref={registerBottomSentinelElement} />
        </div>
      </div>
    </article>
  );
}
