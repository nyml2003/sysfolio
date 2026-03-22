import type { ReactNode } from 'react';

import { clsx } from 'clsx';

import { useStyleContext } from '@/shared/ui/foundation';

type AppShellLayoutProps = {
  topBar: ReactNode;
  navigation: ReactNode;
  content: ReactNode;
  contextPanel: ReactNode;
  activeOverlay: 'none' | 'navigation' | 'context';
  onDismissOverlay: () => void;
};

export function AppShellLayout({
  topBar,
  navigation,
  content,
  contextPanel,
  activeOverlay,
  onDismissOverlay,
}: AppShellLayoutProps) {
  const { layoutMode } = useStyleContext();
  const navigationInline = layoutMode !== 'compact';
  const contextInline = layoutMode === 'spacious';
  const showOverlay = activeOverlay !== 'none' && layoutMode !== 'spacious';

  return (
    <div className="sf-app-shell">
      <div className="sf-app-shell__topbar">{topBar}</div>
      <div className="sf-app-shell__body">
        {navigationInline ? (
          <aside className="sf-app-shell__rail sf-app-shell__rail--navigation">{navigation}</aside>
        ) : null}
        <main className="sf-app-shell__content">{content}</main>
        {contextInline ? (
          <aside className="sf-app-shell__rail sf-app-shell__rail--context">{contextPanel}</aside>
        ) : null}
      </div>
      {showOverlay ? (
        <div className="sf-app-shell__overlay-layer">
          <button
            aria-label="Dismiss panel"
            className="sf-app-shell__scrim"
            onClick={onDismissOverlay}
            type="button"
          />
          <aside
            className={clsx(
              'sf-app-shell__overlay-panel',
              activeOverlay === 'navigation'
                ? 'sf-app-shell__overlay-panel--navigation'
                : 'sf-app-shell__overlay-panel--context'
            )}
          >
            {activeOverlay === 'navigation' ? navigation : contextPanel}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
