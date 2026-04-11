import { expect, test } from '@playwright/test';

import {
  articleView,
  contextButton,
  contextDialog,
  expectPath,
  fileTreeItem,
  labels,
} from './helpers/routes';

test('supports desktop navigation rail and context overlay on article routes', async ({ page }) => {
  await page.goto('/foundation/style-provider');
  await expectPath(page, '/foundation/style-provider');
  await expect(articleView(page)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'StyleProvider' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 4, name: labels.fileTree.title })).toBeVisible();

  await fileTreeItem(page, 'Foundation').click();

  await expectPath(page, '/foundation');
  await expect(page.getByRole('heading', { level: 1, name: 'Foundation' })).toBeVisible();

  await page.goto('/foundation/style-provider');
  await expectPath(page, '/foundation/style-provider');
  await expect(articleView(page)).toBeVisible();

  await contextButton(page).click();

  await expect(contextDialog(page)).toBeVisible();
  await expect(
    contextDialog(page).getByRole('heading', { level: 4, name: labels.contextPanel.tocTitle })
  ).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(contextDialog(page)).toHaveCount(0);
});

test.describe('spacious desktop layout', () => {
  test.use({
    viewport: {
      width: 1600,
      height: 960,
    },
  });

  test('renders inline navigation and context rails without overlay toggles', async ({ page }) => {
    await page.goto('/foundation/style-provider');
    await expectPath(page, '/foundation/style-provider');
    await expect(articleView(page)).toBeVisible();

    await expect(
      page.getByRole('heading', { level: 4, name: labels.fileTree.title })
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 4, name: labels.contextPanel.tocTitle })
    ).toBeVisible();
    await expect(
      page.getByRole('button', { exact: true, name: labels.shell.filesButton })
    ).toHaveCount(0);
    await expect(
      page.getByRole('button', { exact: true, name: labels.shell.contextButton })
    ).toHaveCount(0);
    await expect(contextDialog(page)).toHaveCount(0);
  });
});
