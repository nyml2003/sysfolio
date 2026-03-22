import type { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ArticleDomProvider } from '@/features/article/providers/ArticleDomProvider';
import { createInMemoryContentRepository } from '@/shared/data/repository';
import { some } from '@/shared/lib/monads/option';
import { emptyState, errorState, loadingState } from '@/shared/lib/resource/resource-state';
import {
  PreferencesContext,
  type PreferencesContextValue,
} from '@/shared/store/preferences/preferences-context';

import { ContentPane } from './ContentPane';

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

function renderWithProviders(node: ReactNode) {
  return render(
    <PreferencesContext.Provider value={some(preferencesValue)}>
      <ArticleDomProvider>{node}</ArticleDomProvider>
    </PreferencesContext.Provider>
  );
}

function createRepository() {
  return createInMemoryContentRepository({
    latencyMs: some(0),
  });
}

describe('ContentPane', () => {
  it('renders loading, empty, and error resource states', () => {
    const noop = () => {};
    const { rerender } = renderWithProviders(
      <ContentPane
        onNavigate={noop}
        resource={loadingState()}
        restoreNoticeVisible={false}
        scrollToTop={noop}
      />
    );

    expect(screen.getByText('Loading content')).toBeTruthy();

    rerender(
      <PreferencesContext.Provider value={some(preferencesValue)}>
        <ArticleDomProvider>
          <ContentPane
            onNavigate={noop}
            resource={emptyState(some('Nothing here yet.'))}
            restoreNoticeVisible={false}
            scrollToTop={noop}
          />
        </ArticleDomProvider>
      </PreferencesContext.Provider>
    );

    expect(screen.getByText('Nothing here yet.')).toBeTruthy();

    rerender(
      <PreferencesContext.Provider value={some(preferencesValue)}>
        <ArticleDomProvider>
          <ContentPane
            onNavigate={noop}
            resource={errorState({ code: 'not_found', message: 'Missing path.' })}
            restoreNoticeVisible={false}
            scrollToTop={noop}
          />
        </ArticleDomProvider>
      </PreferencesContext.Provider>
    );

    expect(screen.getByText('Missing path.')).toBeTruthy();
  });

  it('dispatches ready resources to home, directory, and article renderers', async () => {
    const repository = createRepository();
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    const homeResource = await repository.getRenderableEntryByPath('/');
    const directoryResource = await repository.getRenderableEntryByPath('/foundation');
    const articleResource = await repository.getRenderableEntryByPath('/foundation/style-provider');

    if (
      homeResource.tag !== 'ready' ||
      directoryResource.tag !== 'ready' ||
      articleResource.tag !== 'ready'
    ) {
      throw new Error('Expected ready resources for renderer dispatch tests.');
    }

    if (
      homeResource.value.content.kind !== 'home' ||
      directoryResource.value.content.kind !== 'directory' ||
      articleResource.value.content.kind !== 'article'
    ) {
      throw new Error('Expected home, directory, and article renderable content.');
    }

    const firstDirectoryEntry = directoryResource.value.content.children[0];

    if (firstDirectoryEntry === undefined) {
      throw new Error('Expected at least one directory entry in the foundation fixture.');
    }

    const { rerender } = renderWithProviders(
      <ContentPane
        onNavigate={onNavigate}
        resource={homeResource}
        restoreNoticeVisible={false}
        scrollToTop={() => {}}
      />
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: homeResource.value.content.title,
      })
    ).toBeTruthy();

    rerender(
      <PreferencesContext.Provider value={some(preferencesValue)}>
        <ArticleDomProvider>
          <ContentPane
            onNavigate={onNavigate}
            resource={directoryResource}
            restoreNoticeVisible={false}
            scrollToTop={() => {}}
          />
        </ArticleDomProvider>
      </PreferencesContext.Provider>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: directoryResource.value.content.title,
      })
    ).toBeTruthy();

    await user.click(
      screen.getByRole('button', {
        name: new RegExp(firstDirectoryEntry.title, 'i'),
      })
    );

    expect(onNavigate).toHaveBeenCalledWith(firstDirectoryEntry.path);

    rerender(
      <PreferencesContext.Provider value={some(preferencesValue)}>
        <ArticleDomProvider>
          <ContentPane
            onNavigate={onNavigate}
            resource={articleResource}
            restoreNoticeVisible={false}
            scrollToTop={() => {}}
          />
        </ArticleDomProvider>
      </PreferencesContext.Provider>
    );

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: articleResource.value.content.title,
      })
    ).toBeTruthy();
  });
});
