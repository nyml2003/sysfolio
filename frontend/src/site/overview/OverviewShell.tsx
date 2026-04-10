import { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import type { ArticleDocument, BreadcrumbSegment } from '@/entities/content';
import { useArticleDom } from '@/features/article/context/article-dom.context';
import { ArticleDomProvider } from '@/features/article/providers/ArticleDomProvider';
import { useArticleReading } from '@/features/article/hooks/useArticleReading';
import { useRenderableEntry } from '@/features/content-pane/hooks/useRenderableEntry';
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
  const resource = useRenderableEntry(currentPath);
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
              resource.tag === 'error'
                ? resource.error.message
                : resource.tag === 'loading'
                  ? copy.shellViewState.loadingBody
                  : copy.shellViewState.notRenderableBody
            )}
            state={
              resource.tag === 'ready'
                ? 'ready'
                : resource.tag === 'error'
                  ? 'error'
                  : resource.tag === 'empty'
                    ? 'empty'
                    : 'loading'
            }
            title={
              resource.tag === 'error'
                ? some(copy.shellViewState.errorTitle)
                : resource.tag === 'empty'
                  ? some(copy.shellViewState.emptyTitle)
                  : resource.tag === 'ready'
                    ? none()
                    : some(copy.shellViewState.loadingTitle)
            }
            actionLabel={none()}
            onAction={none()}
          >
            {resource.tag === 'ready' && resource.value.content.kind === 'home' ? (
              <OverviewHomePage
                content={resource.value.content}
                context={
                  resource.value.context.tag === 'some'
                    ? resource.value.context.value
                    : getDefaultContext()
                }
                onNavigate={onNavigate}
              />
            ) : null}
            {resource.tag === 'ready' && resource.value.content.kind === 'directory' ? (
              <OverviewDirectoryPage onNavigate={onNavigate} payload={resource.value} />
            ) : null}
            {resource.tag === 'ready' && resource.value.content.kind === 'article' ? (
              <OverviewArticlePage
                payload={resource.value}
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
          onNavigate={onNavigate}
          onScrollToHeading={scrollToHeading}
          resource={resource}
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
