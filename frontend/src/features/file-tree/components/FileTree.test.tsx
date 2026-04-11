import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  ContentRepositoryProvider,
  createInMemoryContentRepository,
} from '@/shared/data/repository';
import { some } from '@/shared/lib/monads/option';
import {
  PreferencesContext,
  type PreferencesContextValue,
} from '@/shared/store/preferences/preferences-context';

import { FileTree } from './FileTree';

const preferencesValue: PreferencesContextValue = {
  theme: 'light',
  toggleTheme() {},
  density: 'comfortable',
  setDensity() {},
  locale: 'en-US',
  toggleLocale() {},
  onboardingVisible: false,
  dismissOnboarding() {},
};

function renderFileTree(currentPath: string) {
  const repository = createInMemoryContentRepository({
    latencyMs: some(0),
  });

  return render(
    <ContentRepositoryProvider value={repository}>
      <PreferencesContext.Provider value={some(preferencesValue)}>
        <FileTree currentPath={currentPath} onNavigate={() => {}} />
      </PreferencesContext.Provider>
    </ContentRepositoryProvider>
  );
}

describe('FileTree', () => {
  it('supports arrow key navigation, collapse/expand, and typeahead', async () => {
    const user = userEvent.setup();

    renderFileTree('/foundation/style-provider');

    const styleProvider = await screen.findByRole('treeitem', {
      name: 'StyleProvider',
    });

    styleProvider.focus();
    expect(document.activeElement).toBe(styleProvider);
    expect(styleProvider.getAttribute('aria-selected')).toBe('true');

    await user.keyboard('{ArrowLeft}');

    const foundation = screen.getByRole('treeitem', {
      name: 'Foundation',
    });

    expect(document.activeElement).toBe(foundation);
    expect(foundation.getAttribute('aria-expanded')).toBe('true');

    await user.keyboard('{ArrowLeft}');

    await waitFor(() => {
      expect(foundation.getAttribute('aria-expanded')).toBe('false');
      expect(
        screen.queryByRole('treeitem', {
          name: 'StyleProvider',
        })
      ).toBeNull();
    });

    await user.keyboard('{ArrowRight}');

    await waitFor(() => {
      expect(foundation.getAttribute('aria-expanded')).toBe('true');
      expect(
        screen.getByRole('treeitem', {
          name: 'StyleProvider',
        })
      ).toBeTruthy();
    });

    const firstTreeItem = screen.getAllByRole('treeitem')[0];

    if (firstTreeItem === undefined) {
      throw new Error('Expected at least one visible treeitem.');
    }

    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(firstTreeItem);

    await user.keyboard('pr');
    expect(document.activeElement).toBe(
      screen.getByRole('treeitem', {
        name: 'Primitives',
      })
    );

    await waitFor(() => {
      expect(screen.getByRole('tree').getAttribute('data-typeahead-buffer')).toBeNull();
    });
  });
});
