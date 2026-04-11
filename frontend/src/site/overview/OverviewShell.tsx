import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import type { ArticleDocument, BreadcrumbSegment } from '@/entities/content';
import { useArticleDom } from '@/features/article/context/article-dom.context';
import { ArticleDomProvider } from '@/features/article/providers/ArticleDomProvider';
import { useArticleReading } from '@/features/article/hooks/useArticleReading';
import { useRenderableArtifact } from '@/features/content-pane/hooks/useRenderableArtifact';
import { detachPromise } from '@/shared/lib/async/detach-promise';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { fromNullable, isSome, none, some, type Option } from '@/shared/lib/monads/option';
import { useOverviewCopy } from '@/site/overview/overview-copy';
import { ROOT_PATH, normalizePath, splitPathSegments } from '@/shared/lib/path/content-path';
import { useStyleContext } from '@/shared/ui/foundation';
import { AppShellLayout, ViewStateLayout } from '@/shared/ui/patterns';

import {
  OverviewArticlePage,
  OverviewDirectoryPage,
  OverviewHomePage,
} from './components/OverviewPages';
import {
  OverviewContextPanel,
  OverviewFileTree,
  OverviewPathBar,
} from './components/OverviewPanels';

function buildFallbackBreadcrumbs(path: string): BreadcrumbSegment[] {
  const segments = splitPathSegments(path);
  const rootBreadcrumb: BreadcrumbSegment = {
    id: 'root',
    title: 'system-library',
    path: ROOT_PATH,
  };
  const resolvedBreadcrumbs = segments.reduce<{
    breadcrumbs: BreadcrumbSegment[];
    currentSegments: string[];
  }>(
    (state, segment) => {
      const currentSegments = [...state.currentSegments, segment];

      return {
        currentSegments,
        breadcrumbs: [
          ...state.breadcrumbs,
          {
            id: currentSegments.join('/'),
            title: segment,
            path: `/${currentSegments.join('/')}`,
          },
        ],
      };
    },
    {
      breadcrumbs: [rootBreadcrumb],
      currentSegments: [],
    }
  );

  return resolvedBreadcrumbs.breadcrumbs.length === 1
    ? [
        ...resolvedBreadcrumbs.breadcrumbs,
        {
          id: 'home',
          title: 'overview',
          path: ROOT_PATH,
        },
      ]
    : resolvedBreadcrumbs.breadcrumbs;
}

function getDefaultContext() {
  return {
    breadcrumbs: [],
    parent: none(),
    siblings: [],
    recentEntries: [],
    stats: none(),
  };
}

function OverviewContent({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  onNavigate: (path: string) => void;
}) {
  const { layoutMode } = useStyleContext();
  const copy = useOverviewCopy();
  const uiCopy = useUiCopy();
  const { registerScrollContainer } = useArticleDom();
  const artifactResource = useRenderableArtifact(currentPath);
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'navigation' | 'context'>('none');
  const artifactContent =
    artifactResource.tag === 'ready' ? artifactResource.value.artifact : false;
  const articleDocument = useMemo<Option<ArticleDocument>>(() => {
    if (artifactContent === false || artifactContent.kind !== 'article') {
      return none();
    }

    return some(artifactContent);
  }, [artifactContent]);
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
    artifactResource.tag === 'ready' && isSome(artifactResource.value.context)
      ? artifactResource.value.context.value.breadcrumbs
      : buildFallbackBreadcrumbs(currentPath);

  useEffect(() => {
    setActiveOverlay('none');
  }, [currentPath, layoutMode]);

  return (
    <AppShellLayout
      activeOverlay={activeOverlay}
      content={
        <div className="overview-scroll-region" ref={registerScrollContainerElement}>
          <ViewStateLayout
            body={some(
              artifactResource.tag === 'error'
                ? artifactResource.error.message
                : artifactResource.tag === 'loading'
                  ? copy.shellViewState.loadingBody
                  : copy.shellViewState.notRenderableBody
            )}
            state={
              artifactResource.tag === 'ready'
                ? 'ready'
                : artifactResource.tag === 'error'
                  ? 'error'
                  : artifactResource.tag === 'empty'
                    ? 'empty'
                    : 'loading'
            }
            title={
              artifactResource.tag === 'error'
                ? some(copy.shellViewState.errorTitle)
                : artifactResource.tag === 'empty'
                  ? some(copy.shellViewState.emptyTitle)
                  : artifactResource.tag === 'ready'
                    ? none()
                    : some(copy.shellViewState.loadingTitle)
            }
            actionLabel={none()}
            onAction={none()}
          >
            {artifactResource.tag === 'ready' && artifactResource.value.artifact.kind === 'home' ? (
              <OverviewHomePage
                content={artifactResource.value.artifact}
                context={
                  artifactResource.value.context.tag === 'some'
                    ? artifactResource.value.context.value
                    : getDefaultContext()
                }
                onNavigate={onNavigate}
              />
            ) : null}
            {artifactResource.tag === 'ready' &&
            artifactResource.value.artifact.kind === 'directory' ? (
              <OverviewDirectoryPage
                onNavigate={onNavigate}
                artifactPayload={artifactResource.value}
              />
            ) : null}
            {artifactResource.tag === 'ready' &&
            artifactResource.value.artifact.kind === 'article' ? (
              <OverviewArticlePage
                artifactPayload={artifactResource.value}
                restoreNoticeVisible={restoreNoticeVisible}
                scrollToTop={scrollToTop}
              />
            ) : null}
          </ViewStateLayout>
        </div>
      }
      contextPanel={
        <OverviewContextPanel
          activeHeadingId={activeHeadingId}
          artifactResource={artifactResource}
          onNavigate={onNavigate}
          onScrollToHeading={scrollToHeading}
        />
      }
      navigation={<OverviewFileTree currentPath={currentPath} onNavigate={onNavigate} />}
      onDismissOverlay={() => {
        setActiveOverlay('none');
      }}
      contextOverlayLabel={uiCopy.appShell.contextPanelLabel}
      dismissOverlayLabel={uiCopy.appShell.dismissOverlay}
      navigationOverlayLabel={uiCopy.appShell.navigationPanelLabel}
      topBar={
        <OverviewPathBar
          breadcrumbs={breadcrumbs}
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

function OverviewRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = normalizePath(location.pathname);

  return (
    <ArticleDomProvider>
      <OverviewContent
        currentPath={currentPath}
        onNavigate={(path) => {
          detachPromise(navigate(path));
        }}
      />
    </ArticleDomProvider>
  );
}

export function OverviewShell() {
  return (
    <Routes>
      <Route element={<OverviewRoute />} path="*" />
    </Routes>
  );
}
