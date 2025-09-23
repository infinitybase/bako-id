import { defineConfig } from '@playwright/test';

export default defineConfig({
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
    headless: false,
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    baseURL: 'http://localhost:5174',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  webServer: {
    command: 'pnpm vite preview --port 5174',
    url: 'http://localhost:5174',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
