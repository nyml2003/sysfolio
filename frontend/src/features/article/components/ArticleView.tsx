import { useCallback, useEffect, useMemo } from 'react';

import type { ArticleDocument, ContentNode } from '@/entities/content';
import { useArticleDom } from '@/features/article/context/article-dom.context';
import { formatDate } from '@/shared/lib/date/format-date';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { fromNullable, none, unwrapOr } from '@/shared/lib/monads/option';
import { usePreferences } from '@/shared/store/preferences';
import { Inline, Stack } from '@/shared/ui/layout';
import { ButtonSecondaryMd, Heading, Notice, Tag, Text } from '@/shared/ui/primitives';

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
    [id, registerHeading]
  );

  return (
    <Heading
      id={id}
      level={level}
      ref={registerHeadingElement}
      leadingIcon={none()}
      trailingMeta={none()}
      tone="default"
      variant={level === 2 ? 'section' : 'subsection'}
    >
      {title}
    </Heading>
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
  const updatedAt = unwrapOr(node.updatedAt, '');
  const publishedAt = unwrapOr(node.publishedAt, '');
  const readingMinutes = unwrapOr(node.readingMinutes, 0);
  const headingIds = useMemo(
    () => document.sections.map((section) => section.id),
    [document.sections]
  );
  const registerArticleBodyElement = useCallback(
    (node: HTMLDivElement | null) => {
      registerArticleBody(fromNullable(node));
    },
    [registerArticleBody]
  );
  const registerBottomSentinelElement = useCallback(
    (node: HTMLDivElement | null) => {
      registerBottomSentinel(fromNullable(node));
    },
    [registerBottomSentinel]
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
    <Stack align="center" as="article" className="sf-article-view" gap="lg">
      <Stack className="sf-article-view__inner" gap="lg">
        <Stack as="header" gap="sm">
          <Text tone="muted" variant="caption">
            {document.eyebrow}
          </Text>
          <Heading
            level={1}
            leadingIcon={none()}
            tone="default"
            trailingMeta={none()}
            variant="display"
          >
            {document.title}
          </Heading>
          <Inline gap="sm" wrap>
            {publishedAt === '' ? null : (
              <Tag>{copy.article.publishedAt(formatDate(publishedAt, locale))}</Tag>
            )}
            {updatedAt === '' ? null : (
              <Tag>{copy.article.updatedAt(formatDate(updatedAt, locale))}</Tag>
            )}
            {readingMinutes === 0 ? null : <Tag>{copy.common.minuteCount(readingMinutes)}</Tag>}
          </Inline>
          <Text tone="muted" variant="body">
            {document.summary}
          </Text>
        </Stack>
        {restoreNoticeVisible ? (
          <Notice title={copy.article.restoreNotice}>
            <ButtonSecondaryMd onClick={scrollToTop}>{copy.article.scrollToTop}</ButtonSecondaryMd>
          </Notice>
        ) : null}
        <div className="sf-article-view__body" ref={registerArticleBodyElement}>
          <Stack gap="lg">
            {document.sections.map((section) => (
              <Stack as="section" gap="sm" key={section.id}>
                <ArticleHeading id={section.id} level={section.level} title={section.title} />
                {section.paragraphs.map((paragraph) => (
                  <Text
                    key={`${section.id}-${paragraph.slice(0, 12)}`}
                    tone="default"
                    variant="body"
                  >
                    {paragraph}
                  </Text>
                ))}
              </Stack>
            ))}
            <div
              aria-hidden="true"
              className="sf-article-view__bottom-sentinel"
              ref={registerBottomSentinelElement}
            />
          </Stack>
        </div>
      </Stack>
    </Stack>
  );
}
