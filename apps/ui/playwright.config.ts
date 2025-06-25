import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 180000,
  expect: {
    timeout: 6000,
  },
  reporter: process.env.CI ? 'blob' : 'html',
  use: {
    headless: true,
    screenshot: process.env.CI ? 'off' : 'only-on-failure',
    video: process.env.CI ? 'on-first-retry' : 'on',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    baseURL: 'https://preview.bako.id/',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
