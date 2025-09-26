import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './tests/ultils/global-setup.ts',
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  timeout: 150000,
  expect: {
    timeout: 8000,
  },
  reporter: 'blob',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    baseURL: 'http://localhost:5173',
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  webServer: [
    {
      command: 'pnpm --filter ui dev',
      url: 'http://localhost:5173',
      name: 'UI',
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'pnpm --filter server start',
      url: 'http://localhost:3000',
      name: 'Server',
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    }
  ],
});
