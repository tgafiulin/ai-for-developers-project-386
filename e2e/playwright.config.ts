import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: '.',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  retries: 1,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
  ],
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  webServer: process.env.CI
    ? undefined
    : [
        {
          command: 'npx tsx src/main.ts',
          cwd: 'backend',
          port: 3001,
          timeout: 15_000,
          reuseExistingServer: true,
        },
        {
          command: 'npx vite --port 5173',
          cwd: 'frontend',
          port: 5173,
          timeout: 15_000,
          reuseExistingServer: true,
        },
      ],
})
