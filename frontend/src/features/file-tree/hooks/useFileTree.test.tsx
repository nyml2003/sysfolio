import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { ChildrenPagePayload, ContentNode, RepositoryError } from '@/entities/content';
import type { ContentRepository } from '@/shared/data/repository';
import {
  ContentRepositoryProvider,
  createInMemoryContentRepository,
} from '@/shared/data/repository';
import { none, some } from '@/shared/lib/monads/option';
import { errorState, readyState } from '@/shared/lib/resource/resource-state';
import {
  PreferencesContext,
  type PreferencesContextValue,
} from '@/shared/store/preferences/preferences-context';

import { useFileTree } from './useFileTree';

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((nextResolve) => {
    resolve = nextResolve;
  });

  return {
    promise,
    resolve,
  };
}

function createPreferencesValue(
  locale: PreferencesContextValue['locale']
): PreferencesContextValue {
  return {
    theme: 'light',
    toggleTheme() {},
    density: 'comfortable',
    setDensity() {},
    locale,
    toggleLocale() {},
    onboardingVisible: false,
    dismissOnboarding() {},
  };
}

function createRootNode(): ContentNode {
  return {
    id: 'root',
    kind: 'home',
    status: 'available',
    title: 'Root',
    slug: '',
    parentId: none(),
    ancestorIds: [],
    pathSegments: [],
    childrenCount: 1,
    hasChildren: true,
    documentId: none(),
    publishedAt: none(),
    updatedAt: none(),
    readingMinutes: none(),
  };
}

function createDirectoryNode(title: string): ContentNode {
  return {
    id: 'docs',
    kind: 'folder',
    status: 'available',
    title,
    slug: 'docs',
    parentId: some('root'),
    ancestorIds: ['root'],
    pathSegments: ['docs'],
    childrenCount: 1,
    hasChildren: true,
    documentId: none(),
    publishedAt: none(),
    updatedAt: none(),
    readingMinutes: none(),
  };
}

function createArticleNode(title: string): ContentNode {
  return {
    id: 'article',
    kind: 'article',
    status: 'available',
    title,
    slug: 'article',
    parentId: some('docs'),
    ancestorIds: ['root', 'docs'],
    pathSegments: ['docs', 'article'],
    childrenCount: 0,
    hasChildren: false,
    documentId: some('article'),
    publishedAt: none(),
    updatedAt: none(),
    readingMinutes: some(5),
  };
}

function createChildrenPayload(title: string) {
  return readyState<ChildrenPagePayload, RepositoryError>({
    parentId: 'docs',
    nodes: [createArticleNode(title)],
    nextPage: none(),
  });
}

function UseFileTreeHarness({ currentPath }: { currentPath: string }) {
  const { nodeErrorsById, retryNode, rows } = useFileTree(currentPath);

  return (
    <div>
      <div data-testid="rows">{rows.map((row) => row.node.title).join('|')}</div>
      <div data-testid="errors">{Object.keys(nodeErrorsById).join('|')}</div>
      <button
        onClick={() => {
          retryNode('docs');
        }}
        type="button"
      >
        Retry docs
      </button>
    </div>
  );
}

describe('useFileTree', () => {
  it('ignores stale child responses after the locale changes', async () => {
    const user = userEvent.setup();
    let currentLocale: PreferencesContextValue['locale'] = 'en-US';
    const oldChildren = createDeferred<ReturnType<typeof createChildrenPayload>>();
    const nextChildren = createDeferred<ReturnType<typeof createChildrenPayload>>();
    const repository = createInMemoryContentRepository({
      latencyMs: some(0),
    });
    const loadChildrenMock = vi.fn<ContentRepository['loadChildren']>();

    repository.getTreeRoot = () =>
      Promise.resolve(
        readyState({
          rootId: 'root',
          nodes: [
            createRootNode(),
            createDirectoryNode(currentLocale === 'en-US' ? 'Docs' : '文档'),
          ],
        })
      );
    repository.getNodeByPath = () =>
      Promise.resolve(
        readyState<ContentNode, RepositoryError>(
          createDirectoryNode(currentLocale === 'en-US' ? 'Docs' : '文档')
        )
      );
    loadChildrenMock
      .mockImplementationOnce(() => oldChildren.promise)
      .mockImplementationOnce(() => nextChildren.promise);
    repository.loadChildren = loadChildrenMock;

    const { rerender } = render(
      <ContentRepositoryProvider value={repository}>
        <PreferencesContext.Provider value={some(createPreferencesValue('en-US'))}>
          <UseFileTreeHarness currentPath="/docs" />
        </PreferencesContext.Provider>
      </ContentRepositoryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('rows').textContent).toContain('Docs');
    });

    currentLocale = 'zh-CN';

    rerender(
      <ContentRepositoryProvider value={repository}>
        <PreferencesContext.Provider value={some(createPreferencesValue('zh-CN'))}>
          <UseFileTreeHarness currentPath="/docs" />
        </PreferencesContext.Provider>
      </ContentRepositoryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('rows').textContent).toContain('文档');
    });

    await user.click(screen.getByRole('button', { name: 'Retry docs' }));

    await waitFor(() => {
      expect(loadChildrenMock).toHaveBeenCalledTimes(2);
    });

    await act(async () => {
      nextChildren.resolve(createChildrenPayload('中文子项'));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('rows').textContent).toContain('中文子项');
    });

    await act(async () => {
      oldChildren.resolve(createChildrenPayload('English child'));
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(screen.getByTestId('rows').textContent).toContain('中文子项');
      expect(screen.getByTestId('rows').textContent).not.toContain('English child');
    });
  });

  it('tracks node-level child load failures and clears them after retry succeeds', async () => {
    const user = userEvent.setup();
    const repository = createInMemoryContentRepository({
      latencyMs: some(0),
    });

    repository.getTreeRoot = () =>
      Promise.resolve(
        readyState({
          rootId: 'root',
          nodes: [createRootNode(), createDirectoryNode('Docs')],
        })
      );
    repository.getNodeByPath = () =>
      Promise.resolve(readyState<ContentNode, RepositoryError>(createDirectoryNode('Docs')));
    repository.loadChildren = vi
      .fn<ContentRepository['loadChildren']>()
      .mockResolvedValueOnce(
        errorState<ChildrenPagePayload, RepositoryError>({
          code: 'not_found',
          message: 'Docs are temporarily unavailable.',
        })
      )
      .mockResolvedValueOnce(createChildrenPayload('Recovered child'));

    render(
      <ContentRepositoryProvider value={repository}>
        <PreferencesContext.Provider value={some(createPreferencesValue('en-US'))}>
          <UseFileTreeHarness currentPath="/docs" />
        </PreferencesContext.Provider>
      </ContentRepositoryProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('errors').textContent).toBe('docs');
    });

    await user.click(screen.getByRole('button', { name: 'Retry docs' }));

    await waitFor(() => {
      expect(screen.getByTestId('errors').textContent).toBe('');
      expect(screen.getByTestId('rows').textContent).toContain('Recovered child');
    });
  });
});
