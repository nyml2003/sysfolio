import { expect, test } from '@playwright/test';

import {
  articleView,
  contentScrollRegion,
  dismissOnboarding,
  expectPath,
  fileTreeItem,
  labels,
} from './helpers/routes';

const articlePath = '/audit/demo-content-model';

test.use({
  viewport: {
    width: 1440,
    height: 720,
  },
});

test('restores the reading position after leaving and reopening an article on desktop', async ({
  page,
}) => {
  await page.goto(articlePath);
  await expectPath(page, articlePath);
  await expect(articleView(page)).toBeVisible();
  await dismissOnboarding(page);

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

  await fileTreeItem(page, 'Audit').click();

  await expectPath(page, '/audit');

  await page.goto(articlePath);
  await expectPath(page, articlePath);
  await expect(articleView(page)).toBeVisible();
  await expect(page.getByText(labels.article.restoreNotice)).toBeVisible();

  await expect
    .poll(async () => contentScrollRegion(page).evaluate((element) => element.scrollTop))
    .toBeGreaterThan(0);
});
