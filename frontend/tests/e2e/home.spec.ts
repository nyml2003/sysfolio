import { expect, test } from '@playwright/test';

import { expectPath, homeView } from './helpers/routes';

test('renders the home reader view and supports locale switching', async ({ page }) => {
  await page.goto('/');
  await expectPath(page, '/');

  await expect(homeView(page)).toBeVisible();
  await expect(page.getByRole('heading', { level: 1, name: 'UI Library Overview' })).toBeVisible();

  await page.getByRole('button', { name: 'Switch language to 简体中文' }).focus();
  await page.keyboard.press('Enter');

  await expect(page.getByRole('heading', { level: 1, name: 'UI 组件库总览' })).toBeVisible();
  await expect(page.getByRole('button', { exact: true, name: '文件' })).toBeVisible();
  await expect(page.getByRole('button', { exact: true, name: '上下文' })).toBeVisible();
});
