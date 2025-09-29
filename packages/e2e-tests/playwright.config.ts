import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isLocal = process.env.PREVIEW_MODE !== 'true';

export default defineConfig({
  globalSetup: './src/global-setup.ts',
  testDir: './src/tests',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  timeout: 150000,
  expect: {
    timeout: 8000,
  },
  reporter: 'blob',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    baseURL: isLocal ? process.env.BASE_URL_LOCAL : process.env.BASE_URL_PREVIEW,
    permissions: ['clipboard-read', 'clipboard-write'],
  },
  webServer:
    isLocal ? [
      {
        command: 'pnpm --filter ui dev',
        url: process.env.BASE_URL_LOCAL,
        name: 'UI',
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      },
      {
        command: 'pnpm --filter server exec next start -p 3033',
        url: 'http://localhost:3033',
        name: 'Server',
        timeout: 120_000,
        reuseExistingServer: !process.env.CI,
      }
    ] : undefined,
});
