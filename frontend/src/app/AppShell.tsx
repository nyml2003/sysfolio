import { useCallback, useMemo } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import type { ArticleDocument, BreadcrumbSegment } from "@/entities/content";
import { useArticleDom } from "@/features/article/context/article-dom.context";
import { useArticleReading } from "@/features/article/hooks/useArticleReading";
import { ArticleDomProvider } from "@/features/article/providers/ArticleDomProvider";
import { ContentPane } from "@/features/content-pane/components/ContentPane";
import { useRenderableEntry } from "@/features/content-pane/hooks/useRenderableEntry";
import { ContextPanel } from "@/features/context-panel/components/ContextPanel";
import { FileTree } from "@/features/file-tree/components/FileTree";
import { OnboardingHints } from "@/features/onboarding/components/OnboardingHints";
import { PathBar } from "@/features/path-bar/components/PathBar";
import { useUiCopy } from "@/shared/lib/i18n/use-ui-copy";
import { fromNullable, none, some, type Option } from "@/shared/lib/monads/option";
import { ROOT_PATH, normalizePath, splitPathSegments } from "@/shared/lib/path/content-path";
import styles from "./AppShell.module.css";

function buildFallbackBreadcrumbs(path: string, homeTitle: string): BreadcrumbSegment[] {
  const segments = splitPathSegments(path);
  const breadcrumbs: BreadcrumbSegment[] = [
    {
      id: "root",
      title: "sysfolio",
      path: ROOT_PATH,
    },
  ];

  let currentSegments: string[] = [];

  for (const segment of segments) {
    currentSegments = [...currentSegments, segment];
    breadcrumbs.push({
      id: currentSegments.join("/"),
      title: segment,
      path: `/${currentSegments.join("/")}`,
    });
  }

  if (breadcrumbs.length === 1) {
    breadcrumbs.push({
      id: "home",
      title: homeTitle,
      path: ROOT_PATH,
    });
  }

  return breadcrumbs;
}

type ShellContentProps = {
  currentPath: string;
  fallbackBreadcrumbs: BreadcrumbSegment[];
  resource: ReturnType<typeof useRenderableEntry>;
  onNavigate: (path: string) => void;
};

function ShellContent({
  currentPath,
  fallbackBreadcrumbs,
  resource,
  onNavigate,
}: ShellContentProps) {
  const { registerScrollContainer } = useArticleDom();
  const renderableContent = resource.tag === "ready" ? resource.value.content : false;
  const articleDocument = useMemo<Option<ArticleDocument>>(() => {
    if (renderableContent === false || renderableContent.kind !== "article") {
      return none();
    }

    return some(renderableContent);
  }, [renderableContent]);
  const registerScrollContainerElement = useCallback(
    (node: HTMLElement | null) => {
      registerScrollContainer(fromNullable(node));
    },
    [registerScrollContainer],
  );
  const { activeHeadingId, restoreNoticeVisible, scrollToHeading, scrollToTop } =
    useArticleReading({
      path: currentPath,
      document: articleDocument,
    });

  const breadcrumbs =
    resource.tag === "ready" && resource.value.context.tag === "some"
      ? resource.value.context.value.breadcrumbs
      : fallbackBreadcrumbs;
  const pathBarLoading = resource.tag === "idle" || resource.tag === "loading";

  return (
    <div className={styles.root}>
      <PathBar
        breadcrumbs={breadcrumbs}
        isLoading={pathBarLoading}
        onNavigate={onNavigate}
      />
      <div className={styles.body}>
        <div className={styles.left}>
          <FileTree
            currentPath={currentPath}
            onNavigate={onNavigate}
          />
        </div>
        <main className={styles.main} ref={registerScrollContainerElement}>
          <ContentPane
            onNavigate={onNavigate}
            resource={resource}
            restoreNoticeVisible={restoreNoticeVisible}
            scrollToTop={scrollToTop}
          />
        </main>
        <div className={styles.right}>
          <ContextPanel
            activeHeadingId={activeHeadingId}
            onNavigate={onNavigate}
            onScrollToHeading={(headingId) => {
              scrollToHeading(headingId);
            }}
            resource={resource}
          />
        </div>
      </div>
      <OnboardingHints />
    </div>
  );
}

function ShellRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const copy = useUiCopy();
  const currentPath = normalizePath(location.pathname);
  const resource = useRenderableEntry(currentPath);
  const fallbackBreadcrumbs = buildFallbackBreadcrumbs(currentPath, copy.common.homeTitle);

  return (
    <ArticleDomProvider>
      <ShellContent
        currentPath={currentPath}
        fallbackBreadcrumbs={fallbackBreadcrumbs}
        onNavigate={(path) => {
          void navigate(path);
        }}
        resource={resource}
      />
    </ArticleDomProvider>
  );
}

export function AppShell() {
  return (
    <Routes>
      <Route element={<ShellRoute />} path="*" />
    </Routes>
  );
}
