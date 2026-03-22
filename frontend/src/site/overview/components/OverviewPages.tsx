import { useCallback, useEffect, useMemo } from "react";

import type {
  ContextInfo,
  DirectoryContent,
  HomeContent,
  RenderableEntryPayload,
} from "@/entities/content";
import { useArticleDom } from "@/features/article/context/article-dom.context";
import {
  getOverviewDocumentMeta,
  overviewHomeCollections,
} from "@/shared/data/mock/content.fixtures";
import { formatDate } from "@/shared/lib/date/format-date";
import { fromNullable, isSome, none, unwrapOr } from "@/shared/lib/monads/option";
import { usePreferences } from "@/shared/store/preferences";
import { Grid, Inline, Stack, Surface } from "@/shared/ui/layout";
import { Button, Tag } from "@/shared/ui/primitives";

import { OverviewDemoDeck } from "../demo/OverviewDemos";

type OverviewHomePageProps = {
  content: HomeContent;
  context: ContextInfo;
  onNavigate: (path: string) => void;
};

type OverviewDirectoryPageProps = {
  payload: RenderableEntryPayload;
  onNavigate: (path: string) => void;
};

type OverviewArticlePageProps = {
  payload: RenderableEntryPayload;
  restoreNoticeVisible: boolean;
  scrollToTop: () => void;
};

function ArticleHeading({
  id,
  level,
  title,
}: {
  id: string;
  level: 2 | 3 | 4;
  title: string;
}) {
  const { registerHeading } = useArticleDom();
  const registerHeadingElement = useCallback(
    (node: HTMLHeadingElement | null) => {
      registerHeading(id, fromNullable(node));
    },
    [id, registerHeading],
  );

  if (level === 3) {
    return <h3 id={id} ref={registerHeadingElement}>{title}</h3>;
  }

  if (level === 4) {
    return <h4 id={id} ref={registerHeadingElement}>{title}</h4>;
  }

  return <h2 id={id} ref={registerHeadingElement}>{title}</h2>;
}

export function OverviewHomePage({
  content,
  context,
  onNavigate,
}: OverviewHomePageProps) {
  return (
    <Stack className="overview-page" gap="lg">
      <Stack className="overview-hero" gap="sm">
        <div className="overview-eyebrow">system-library / overview</div>
        <h1 className="overview-title">{content.title}</h1>
        <p className="overview-summary">
          A filesystem-style documentation station for the internal UI library. Start with the runtime, move through layout and primitives, and use the audit layer to track missing design coverage.
        </p>
      </Stack>
      <Grid columns={3}>
        {overviewHomeCollections.map((collection) => (
          <Surface key={collection.id}>
            <Stack gap="sm">
              <div className="overview-section-title">{collection.title}</div>
              <p className="overview-copy">{collection.description}</p>
              <Stack gap="xs">
                {collection.paths.map((path) => (
                  <Button key={path} onClick={() => onNavigate(path)} tone="ghost">
                    {path.replaceAll("/", " ").trim()}
                  </Button>
                ))}
              </Stack>
            </Stack>
          </Surface>
        ))}
      </Grid>
      <Surface>
        <Stack gap="sm">
          <div className="overview-section-title">Recently touched docs</div>
          <Grid columns={3}>
            {context.recentEntries.map((entry) => (
              <button className="overview-link-card" key={entry.id} onClick={() => onNavigate(entry.path)} type="button">
                <Stack gap="xs">
                  <strong>{entry.title}</strong>
                  <div className="overview-copy">{unwrapOr(entry.description, "")}</div>
                </Stack>
              </button>
            ))}
          </Grid>
        </Stack>
      </Surface>
    </Stack>
  );
}

export function OverviewDirectoryPage({
  payload,
  onNavigate,
}: OverviewDirectoryPageProps) {
  const content = payload.content as DirectoryContent;

  return (
    <Stack className="overview-page" gap="lg">
      <Stack gap="sm">
        <div className="overview-eyebrow">{payload.node.pathSegments.join(" / ") || "root"}</div>
        <h1 className="overview-title">{content.title}</h1>
        <p className="overview-summary">{unwrapOr(content.description, "Browse the current slice of the UI library.")}</p>
      </Stack>
      <Grid columns={3}>
        {content.children.map((entry) => (
          <button className="overview-link-card" key={entry.id} onClick={() => onNavigate(entry.path)} type="button">
            <Stack gap="sm">
              <Inline align="between" wrap>
                <strong>{entry.title}</strong>
                <Tag>{entry.kind}</Tag>
              </Inline>
              {isSome(entry.readingMinutes) ? (
                <div className="overview-copy">{entry.readingMinutes.value} min read</div>
              ) : null}
              <div className="overview-copy">{unwrapOr(entry.description, "Open this entry to inspect the current contract.")}</div>
            </Stack>
          </button>
        ))}
      </Grid>
    </Stack>
  );
}

export function OverviewArticlePage({
  payload,
  restoreNoticeVisible,
  scrollToTop,
}: OverviewArticlePageProps) {
  const { locale } = usePreferences();
  const { registerArticleBody, registerBottomSentinel, registerHeadingOrder } = useArticleDom();
  const document = payload.content.kind === "article" ? payload.content : null;
  const meta = document === null ? none() : getOverviewDocumentMeta(document.id);
  const headingIds = useMemo(
    () => (document === null ? [] : document.sections.map((section) => section.id)),
    [document],
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

  if (document === null) {
    return null;
  }

  return (
    <article className="overview-page overview-article">
      <Stack gap="lg">
        <Stack className="overview-hero" gap="sm">
          <div className="overview-eyebrow">{document.eyebrow}</div>
          <h1 className="overview-title">{document.title}</h1>
          <Inline gap="sm" wrap>
            {isSome(meta) ? <Tag tone="accent">{meta.value.layer}</Tag> : null}
            {isSome(meta) ? <Tag>{meta.value.status}</Tag> : null}
            {isSome(payload.node.updatedAt) ? (
              <Tag>updated {formatDate(payload.node.updatedAt.value, locale)}</Tag>
            ) : null}
          </Inline>
          <p className="overview-summary">{document.summary}</p>
        </Stack>
        {restoreNoticeVisible ? (
          <Surface tone="accent">
            <Inline align="between" wrap>
              <div className="overview-copy">Restored your previous reading position.</div>
              <Button onClick={scrollToTop} tone="secondary">
                Back to top
              </Button>
            </Inline>
          </Surface>
        ) : null}
        {isSome(meta) ? <OverviewDemoDeck demoIds={meta.value.demoIds} /> : null}
        <div className="overview-article__body" ref={registerArticleBodyElement}>
          {document.sections.map((section) => (
            <section className="overview-article__section" key={section.id}>
              <ArticleHeading id={section.id} level={section.level} title={section.title} />
              {section.paragraphs.map((paragraph) => (
                <p key={`${section.id}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
              ))}
            </section>
          ))}
          <div aria-hidden="true" className="overview-article__sentinel" ref={registerBottomSentinelElement} />
        </div>
      </Stack>
    </article>
  );
}
