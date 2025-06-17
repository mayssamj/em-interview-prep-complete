
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Run tests sequentially for better reliability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Single worker for stability
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results-comprehensive.json' }],
    ['list']
  ],
  timeout: 60000, // 60 second timeout per test
  use: {
    baseURL: process.env.PREVIEW_URL || "http://localhost:3000",
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // Only start web server if running locally
  webServer: process.env.PREVIEW_URL ? undefined : {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
