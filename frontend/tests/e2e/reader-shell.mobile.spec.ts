import { expect, test } from '@playwright/test';

import {
  articleView,
  contextButton,
  contextDialog,
  dismissOnboarding,
  expectPath,
  filesButton,
  labels,
  navigationDialog,
} from './helpers/routes';

test.use({
  viewport: {
    width: 393,
    height: 480,
  },
});

test('keeps mobile overlay navigation and context panels available on article routes', async ({
  page,
}) => {
  await page.goto('/foundation/style-provider');
  await expectPath(page, '/foundation/style-provider');
  await expect(articleView(page)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'StyleProvider' })).toBeVisible();
  await dismissOnboarding(page);

  await filesButton(page).click();

  await expect(navigationDialog(page)).toBeVisible();
  await navigationDialog(page).getByRole('treeitem', { exact: true, name: 'Foundation' }).click();

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
