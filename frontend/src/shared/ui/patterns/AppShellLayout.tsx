import { useEffect, useRef, type ReactNode } from 'react';

import { clsx } from 'clsx';

import { useStyleContext } from '@/shared/ui/foundation';

type AppShellLayoutProps = {
  topBar: ReactNode;
  navigation: ReactNode;
  content: ReactNode;
  contextPanel: ReactNode;
  activeOverlay: 'none' | 'navigation' | 'context';
  onDismissOverlay: () => void;
  dismissOverlayLabel: string;
  navigationOverlayLabel: string;
  contextOverlayLabel: string;
};

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      [
        'button:not([disabled])',
        '[href]',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ].join(', ')
    )
  );
}

export function AppShellLayout({
  topBar,
  navigation,
  content,
  contextPanel,
  activeOverlay,
  onDismissOverlay,
  dismissOverlayLabel,
  navigationOverlayLabel,
  contextOverlayLabel,
}: AppShellLayoutProps) {
  const { layoutMode } = useStyleContext();
  const navigationInline = layoutMode !== 'compact';
  const contextInline = layoutMode === 'spacious';
  const showOverlay = activeOverlay !== 'none' && layoutMode !== 'spacious';
  const overlayPanelRef = useRef<HTMLElement | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!showOverlay) {
      if (lastFocusedElementRef.current?.isConnected === true) {
        lastFocusedElementRef.current.focus();
      }

      lastFocusedElementRef.current = null;
      return undefined;
    }

    lastFocusedElementRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const overlayPanelElement = overlayPanelRef.current;

    if (overlayPanelElement === null) {
      return undefined;
    }

    const focusableElements = getFocusableElements(overlayPanelElement);

    (focusableElements[0] ?? overlayPanelElement).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onDismissOverlay();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const activeFocusableElements = getFocusableElements(overlayPanelElement);

      if (activeFocusableElements.length === 0) {
        event.preventDefault();
        overlayPanelElement.focus();
        return;
      }

      const firstFocusableElement = activeFocusableElements[0];
      const lastFocusableElement = activeFocusableElements.at(-1);

      if (firstFocusableElement === undefined || lastFocusableElement === undefined) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onDismissOverlay, showOverlay]);

  return (
    <div className="sf-app-shell">
      <div aria-hidden={showOverlay} className="sf-app-shell__topbar" inert={showOverlay}>
        {topBar}
      </div>
      <div aria-hidden={showOverlay} className="sf-app-shell__body" inert={showOverlay}>
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
            aria-label={dismissOverlayLabel}
            className="sf-app-shell__scrim"
            onClick={onDismissOverlay}
            type="button"
          />
          <aside
            aria-label={
              activeOverlay === 'navigation' ? navigationOverlayLabel : contextOverlayLabel
            }
            aria-modal="true"
            className={clsx(
              'sf-app-shell__overlay-panel',
              activeOverlay === 'navigation'
                ? 'sf-app-shell__overlay-panel--navigation'
                : 'sf-app-shell__overlay-panel--context'
            )}
            ref={overlayPanelRef}
            role="dialog"
            tabIndex={-1}
          >
            {activeOverlay === 'navigation' ? navigation : contextPanel}
          </aside>
        </div>
      ) : null}
    </div>
  );
}
