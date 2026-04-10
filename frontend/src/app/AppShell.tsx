import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import type { ArticleDocument, BreadcrumbSegment } from '@/entities/content';
import { useArticleDom } from '@/features/article/context/article-dom.context';
import { useArticleReading } from '@/features/article/hooks/useArticleReading';
import { ArticleDomProvider } from '@/features/article/providers/ArticleDomProvider';
import { ContentPane } from '@/features/content-pane/components/ContentPane';
import { useRenderableEntry } from '@/features/content-pane/hooks/useRenderableEntry';
import { ContextPanel } from '@/features/context-panel/components/ContextPanel';
import { FileTree } from '@/features/file-tree/components/FileTree';
import { OnboardingHints } from '@/features/onboarding/components/OnboardingHints';
import { PathBar } from '@/features/path-bar/components/PathBar';
import { detachPromise } from '@/shared/lib/async/detach-promise';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { fromNullable, isSome, none, some, type Option } from '@/shared/lib/monads/option';
import { normalizePath } from '@/shared/lib/path/content-path';
import { AppShellLayout } from '@/shared/ui/patterns';
import { useStyleContext } from '@/shared/ui/foundation';

import { APP_SHELL_ROUTE_PATH } from './constant';
import { buildFallbackBreadcrumbs } from './app-shell.model';

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
  const copy = useUiCopy();
  const { layoutMode } = useStyleContext();
  const { registerScrollContainer } = useArticleDom();
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'navigation' | 'context'>('none');
  const renderableContent = resource.tag === 'ready' ? resource.value.content : false;
  const articleDocument = useMemo<Option<ArticleDocument>>(() => {
    if (renderableContent === false || renderableContent.kind !== 'article') {
      return none();
    }

    return some(renderableContent);
  }, [renderableContent]);
  const registerScrollContainerElement = useCallback(
    (node: HTMLElement | null) => {
      registerScrollContainer(fromNullable(node));
    },
    [registerScrollContainer]
  );
  const { activeHeadingId, restoreNoticeVisible, scrollToHeading, scrollToTop } = useArticleReading(
    {
      path: currentPath,
      document: articleDocument,
    }
  );

  const breadcrumbs =
    resource.tag === 'ready' && isSome(resource.value.context)
      ? resource.value.context.value.breadcrumbs
      : fallbackBreadcrumbs;
  const pathBarLoading = resource.tag === 'idle' || resource.tag === 'loading';

  useEffect(() => {
    setActiveOverlay('none');
  }, [currentPath, layoutMode]);

  return (
    <AppShellLayout
      activeOverlay={activeOverlay}
      content={
        <div
          className="sf-app-shell__content-scroll-region"
          data-testid="content-scroll-region"
          ref={registerScrollContainerElement}
        >
          <ContentPane
            onNavigate={onNavigate}
            resource={resource}
            restoreNoticeVisible={restoreNoticeVisible}
            scrollToTop={scrollToTop}
          />
        </div>
      }
      contextPanel={
        <ContextPanel
          activeHeadingId={activeHeadingId}
          onNavigate={onNavigate}
          onScrollToHeading={(headingId) => {
            scrollToHeading(headingId);
          }}
          resource={resource}
        />
      }
      navigation={<FileTree currentPath={currentPath} onNavigate={onNavigate} />}
      onDismissOverlay={() => {
        setActiveOverlay('none');
      }}
      contextOverlayLabel={copy.appShell.contextPanelLabel}
      dismissOverlayLabel={copy.appShell.dismissOverlay}
      navigationOverlayLabel={copy.appShell.navigationPanelLabel}
      topBar={
        <PathBar
          breadcrumbs={breadcrumbs}
          isLoading={pathBarLoading}
          onNavigate={onNavigate}
          onOpenContext={() => {
            setActiveOverlay('context');
          }}
          onOpenNavigation={() => {
            setActiveOverlay('navigation');
          }}
        />
      }
    />
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
      <>
        <ShellContent
          currentPath={currentPath}
          fallbackBreadcrumbs={fallbackBreadcrumbs}
          onNavigate={(path) => {
            detachPromise(navigate(path));
          }}
          resource={resource}
        />
        <OnboardingHints />
      </>
    </ArticleDomProvider>
  );
}

export function AppShell() {
  return (
    <Routes>
      <Route element={<ShellRoute />} path={APP_SHELL_ROUTE_PATH} />
    </Routes>
  );
}
