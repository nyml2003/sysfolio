import { expect, test } from '@playwright/test';

import {
  articleView,
  contentScrollRegion,
  expectPath,
  filesButton,
  navigationDialog,
} from './helpers/routes';

test.use({
  viewport: {
    width: 393,
    height: 480,
  },
});

test('restores the reading position after leaving and reopening an article', async ({ page }) => {
  await page.goto('/foundation/style-provider');
  await expectPath(page, '/foundation/style-provider');
  await expect(articleView(page)).toBeVisible();

  const region = contentScrollRegion(page);
  const maxScroll = await region.evaluate((element) => element.scrollHeight - element.clientHeight);

  expect(maxScroll).toBeGreaterThan(0);

  const targetScrollTop = Math.min(360, maxScroll);

  await region.evaluate((element, nextScrollTop) => {
    element.scrollTop = nextScrollTop;
    element.dispatchEvent(new Event('scroll', { bubbles: true }));
  }, targetScrollTop);

  await expect
    .poll(async () => contentScrollRegion(page).evaluate((element) => element.scrollTop))
    .toBe(targetScrollTop);

  await filesButton(page).click();
  await expect(navigationDialog(page)).toBeVisible();
  await navigationDialog(page).getByRole('button', { exact: true, name: 'Foundation' }).focus();
  await page.keyboard.press('Enter');

  await expectPath(page, '/foundation');

  await page.goBack();
  await expectPath(page, '/foundation/style-provider');
  await expect(articleView(page)).toBeVisible();

  await expect
    .poll(async () => contentScrollRegion(page).evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
});
