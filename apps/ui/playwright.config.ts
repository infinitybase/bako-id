import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './tests/ultils/global-setup.ts',
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 160000,
  expect: {
    timeout: 8000,
  },
  reporter: 'blob',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    baseURL: 'https://preview.bako.id/',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
});
