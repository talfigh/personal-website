import { defineConfig, devices } from '@playwright/test';

const port = 4173;

// Tests run against the production build served by `vite preview`,
// which sends the same security headers as CloudFront.
export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run preview -- --port ${port} --strictPort`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
