import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { some } from '@/shared/lib/monads/option';
import type { ResolvedStyleContextValue } from '@/shared/lib/style/style.types';
import { StyleContext } from '@/shared/ui/foundation/style-context';

import { AppShellLayout } from './AppShellLayout';

const styleValue = some<ResolvedStyleContextValue>({
  theme: 'light',
  density: 'comfortable',
  layoutMode: 'compact',
  motion: 'full',
});

function AppShellLayoutHarness() {
  const [activeOverlay, setActiveOverlay] = useState<'none' | 'navigation' | 'context'>('none');

  return (
    <StyleContext.Provider value={styleValue}>
      <AppShellLayout
        activeOverlay={activeOverlay}
        content={<div>Content</div>}
        contextOverlayLabel="Context panel"
        contextPanel={<button type="button">Context action</button>}
        dismissOverlayLabel="Dismiss panel"
        navigation={
          <>
            <button type="button">Nav action</button>
            <button type="button">Second nav action</button>
          </>
        }
        navigationOverlayLabel="File navigation"
        onDismissOverlay={() => {
          setActiveOverlay('none');
        }}
        topBar={
          <button
            onClick={() => {
              setActiveOverlay('navigation');
            }}
            type="button"
          >
            Open navigation
          </button>
        }
      />
    </StyleContext.Provider>
  );
}

describe('AppShellLayout', () => {
  it('focuses the overlay, closes on Escape, and restores focus to the trigger', async () => {
    const user = userEvent.setup();

    render(<AppShellLayoutHarness />);

    const openButton = screen.getByRole('button', { name: 'Open navigation' });

    await user.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'File navigation' })).toBeTruthy();
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Nav action' }));
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'File navigation' })).toBeNull();
      expect(document.activeElement).toBe(openButton);
    });
  });

  it('traps tab focus within the overlay and marks the background as inert', async () => {
    const user = userEvent.setup();

    render(<AppShellLayoutHarness />);

    const openButton = screen.getByRole('button', { name: 'Open navigation' });

    await user.click(openButton);

    const dialog = await screen.findByRole('dialog', { name: 'File navigation' });
    const firstAction = screen.getByRole('button', { name: 'Nav action' });
    const lastAction = screen.getByRole('button', { name: 'Second nav action' });

    await waitFor(() => {
      expect(document.activeElement).toBe(firstAction);
      expect(
        screen.getByText('Content').closest('.sf-app-shell__body')?.getAttribute('inert')
      ).toBe('');
      expect(openButton.closest('.sf-app-shell__topbar')?.getAttribute('inert')).toBe('');
    });

    await user.keyboard('{Tab}');
    expect(document.activeElement).toBe(lastAction);

    await user.keyboard('{Tab}');
    expect(document.activeElement).toBe(firstAction);

    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toBe(lastAction);

    expect(dialog).toBeTruthy();
  });
});
