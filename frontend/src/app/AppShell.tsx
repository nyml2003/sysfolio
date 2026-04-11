import { useCallback } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { useArticleDom } from '@/features/article/context/article-dom.context';
import { ArticleDomProvider } from '@/features/article/providers/ArticleDomProvider';
import { OnboardingHints } from '@/features/onboarding/components/OnboardingHints';
import { PathBar } from '@/features/path-bar/components/PathBar';
import { ReaderContentPane } from '@/features/reader/components/ReaderContentPane';
import { ReaderContextPanel } from '@/features/reader/components/ReaderContextPanel';
import { ReaderFileTree } from '@/features/reader/components/ReaderFileTree';
import { useReaderActions } from '@/features/reader/hooks/useReaderActions';
import { useReaderSelector } from '@/features/reader/hooks/useReaderSelector';
import { ReaderProvider } from '@/features/reader/providers/ReaderProvider';
import { detachPromise } from '@/shared/lib/async/detach-promise';
import { useUiCopy } from '@/shared/lib/i18n/use-ui-copy';
import { fromNullable } from '@/shared/lib/monads/option';
import { normalizePath } from '@/shared/lib/path/content-path';
import { AppShellLayout } from '@/shared/ui/patterns';

import { APP_SHELL_ROUTE_PATH } from './constant';

type ShellContentProps = {
  onNavigate: (path: string) => void;
};

function ShellContent({ onNavigate }: ShellContentProps) {
  const copy = useUiCopy();
  const { registerScrollContainer } = useArticleDom();
  const { closeOverlay, openContextOverlay, openNavigationOverlay } = useReaderActions();
  const activeOverlay = useReaderSelector((state) => state.overlay.activeOverlay);
  const breadcrumbs = useReaderSelector((state) => state.breadcrumbs);
  const pathBarLoading = useReaderSelector((state) => state.pathBarLoading);
  const registerScrollContainerElement = useCallback(
    (node: HTMLElement | null) => {
      registerScrollContainer(fromNullable(node));
    },
    [registerScrollContainer]
  );

  return (
    <AppShellLayout
      activeOverlay={activeOverlay}
      content={
        <div
          className="sf-app-shell__content-scroll-region"
          data-testid="content-scroll-region"
          ref={registerScrollContainerElement}
        >
          <ReaderContentPane onNavigate={onNavigate} />
        </div>
      }
      contextPanel={<ReaderContextPanel onNavigate={onNavigate} />}
      navigation={<ReaderFileTree onNavigate={onNavigate} />}
      onDismissOverlay={() => {
        closeOverlay();
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
            openContextOverlay();
          }}
          onOpenNavigation={() => {
            openNavigationOverlay();
          }}
        />
      }
    />
  );
}

function ShellRoute() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = normalizePath(location.pathname);

  return (
    <ArticleDomProvider>
      <ReaderProvider currentPath={currentPath}>
        <>
          <ShellContent
            onNavigate={(path) => {
              detachPromise(navigate(path));
            }}
          />
          <OnboardingHints />
        </>
      </ReaderProvider>
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
