import { expect, test } from '@playwright/test';

import { contextButton, expectPath, homeView, labels } from './helpers/routes';

test('renders the home reader view and supports locale switching on desktop', async ({ page }) => {
  await page.goto('/');
  await expectPath(page, '/');

  await expect(homeView(page)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'UI Library Overview' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 4, name: labels.fileTree.title })).toBeVisible();
  await expect(
    page.getByRole('button', { exact: true, name: labels.shell.filesButton })
  ).toHaveCount(0);
  await expect(contextButton(page)).toBeVisible();

  await page.getByRole('button', { name: 'Switch language to 简体中文' }).click();

  await expect(page.getByRole('heading', { level: 1, name: 'UI 组件库总览' })).toBeVisible();
  await expect(page.getByRole('heading', { level: 4, name: '文件树' })).toBeVisible();
  await expect(page.getByRole('button', { exact: true, name: '上下文' })).toBeVisible();
  await expect(page.getByRole('button', { exact: true, name: '文件' })).toHaveCount(0);
});
