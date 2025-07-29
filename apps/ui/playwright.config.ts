import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 180000,
  expect: {
    timeout: 8000,
  },
  reporter: 'null',
  use: {
    headless: true,
    screenshot: process.env.CI ? 'off' : 'only-on-failure',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    baseURL: 'https://preview.bako.id/',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
});
