import { expect, test } from '@playwright/test';

import {
  articleView,
  contextButton,
  contextDialog,
  expectPath,
  filesButton,
  navigationDialog,
} from './helpers/routes';

test('supports mobile overlay navigation and context panels on article routes', async ({
  page,
}) => {
  await page.goto('/foundation/style-provider');
  await expectPath(page, '/foundation/style-provider');
  await expect(articleView(page)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'StyleProvider' })).toBeVisible();

  await filesButton(page).click();

  await expect(navigationDialog(page)).toBeVisible();
  await navigationDialog(page).getByRole('button', { exact: true, name: 'Foundation' }).focus();
  await page.keyboard.press('Enter');

  await expectPath(page, '/foundation');
  await expect(page.getByRole('heading', { level: 1, name: 'Foundation' })).toBeVisible();

  await page.goBack();

  await expectPath(page, '/foundation/style-provider');
  await expect(articleView(page)).toBeVisible();

  await contextButton(page).focus();
  await page.keyboard.press('Enter');

  await expect(contextDialog(page)).toBeVisible();
  await expect(
    contextDialog(page).getByRole('heading', { level: 4, name: 'Table of contents' })
  ).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(contextDialog(page)).toHaveCount(0);
});
