import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:4173';
const desktopViewport = {
  width: 1440,
  height: 960,
};

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: ['**/*.spec.ts'],
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    headless: true,
    trace: 'on-first-retry',
    viewport: desktopViewport,
  },
  webServer: {
    command: 'pnpm exec vite --host 127.0.0.1 --port 4173',
    reuseExistingServer: false,
    timeout: 120 * 1000,
    url: baseURL,
  },
});
