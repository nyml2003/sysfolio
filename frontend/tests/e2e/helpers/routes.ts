import { expect, type Locator, type Page } from '@playwright/test';

export const labels = {
  article: {
    restoreNotice: 'Restored your previous reading position.',
  },
  contextPanel: {
    placeholderTitle: 'Context',
    tocTitle: 'Table of contents',
  },
  fileTree: {
    ariaLabel: 'File tree',
    title: 'Filesystem',
  },
  onboarding: {
    dismiss: 'Dismiss',
  },
  shell: {
    contextButton: 'Context',
    contextPanel: 'Context panel',
    filesButton: 'Files',
    navigationPanel: 'File navigation',
  },
} as const;

export const testIds = {
  articleView: 'article-view',
  contentScrollRegion: 'content-scroll-region',
  homeView: 'home-view',
} as const;

function escapeForRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function expectPath(page: Page, path: string) {
  const normalizedPath = path === '/' ? '/' : path.replace(/\/+$/, '');
  const pattern =
    normalizedPath === '/' ? /\/$/ : new RegExp(`${escapeForRegExp(normalizedPath)}$`);

  await expect(page).toHaveURL(pattern);
}

export async function dismissOnboarding(page: Page) {
  const dismissButton = page.getByRole('button', {
    exact: true,
    name: labels.onboarding.dismiss,
  });

  if ((await dismissButton.count()) > 0) {
    await dismissButton.click();
  }
}

export function articleView(page: Page) {
  return page.getByTestId(testIds.articleView);
}

export function contentScrollRegion(page: Page) {
  return page.getByTestId(testIds.contentScrollRegion);
}

export function contextButton(page: Page) {
  return page.getByRole('button', { exact: true, name: labels.shell.contextButton });
}

export function contextDialog(page: Page) {
  return page.getByRole('dialog', { name: labels.shell.contextPanel });
}

export function filesButton(page: Page) {
  return page.getByRole('button', { exact: true, name: labels.shell.filesButton });
}

export function homeView(page: Page) {
  return page.getByTestId(testIds.homeView);
}

export function fileTree(scope: Page | Locator) {
  return scope.getByRole('complementary', { name: labels.fileTree.ariaLabel });
}

export function fileTreeItem(scope: Page | Locator, name: string) {
  return scope.getByRole('treeitem', { exact: true, name });
}

export function navigationDialog(page: Page) {
  return page.getByRole('dialog', { name: labels.shell.navigationPanel });
}

export function tocButton(scope: Locator, name: string) {
  return scope.getByRole('button', { exact: true, name });
}
