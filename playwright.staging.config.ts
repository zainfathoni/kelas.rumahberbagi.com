import { PlaywrightTestConfig, devices } from '@playwright/test'
import { Fixtures } from './e2e/base-test'

const config: PlaywrightTestConfig<Fixtures> = {
  forbidOnly: true,
  retries: 0,
  testDir: './e2e',
  globalSetup: require.resolve('./playwright-staging-setup'),
  globalTimeout: 15 * 60 * 1000,
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  use: {
    trace: 'on-first-retry',
    baseURL: 'https://staging.kelas.rumahberbagi.com',
    actionTimeout: 15 * 1000,
    navigationTimeout: 30 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
}
export default config
