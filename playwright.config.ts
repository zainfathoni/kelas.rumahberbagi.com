import { PlaywrightTestConfig, devices } from '@playwright/test'
import { Fixtures } from './e2e/base-test'

const config: PlaywrightTestConfig<Fixtures> = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
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
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'noscript',
      use: {
        ...devices['Desktop Chrome'],
        javaScriptEnabled: false,
        noscript: true,
      },
    },
  ],
}
export default config
