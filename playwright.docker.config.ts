import { PlaywrightTestConfig, devices } from '@playwright/test'
import { Fixtures } from './e2e/base-test'

/**
 * Playwright configuration for testing Docker/Kamal deployments
 *
 * Usage:
 *   npm run test:e2e:docker              # Test local Docker container (localhost:3000)
 *   npm run test:e2e:production          # Test production (kelas.rumahberbagi.com)
 *   DOCKER_URL=http://host:port npm run test:e2e:docker  # Custom URL
 *
 * This config differs from the main config:
 *   - Uses DOCKER_URL env var for flexible target URLs
 *   - No test server (expects container already running)
 *   - Reduced test parallelism for stability
 *   - Smoke tests subset by default (can be overridden)
 */

const baseURL =
  process.env.DOCKER_URL || process.env.BASE_URL || 'http://localhost:3000'

const config: PlaywrightTestConfig<Fixtures> = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  testDir: './e2e',
  globalTimeout: 10 * 60 * 1000,
  timeout: 30000,
  workers: 2,
  use: {
    trace: 'on-first-retry',
    baseURL,
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 4'],
      },
    },
  ],
}

export default config
