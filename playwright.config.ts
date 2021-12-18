import { PlaywrightTestConfig, devices } from '@playwright/test'
import { TestOptions } from './e2e/base-test'

const config: PlaywrightTestConfig<TestOptions> = {
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
      use: { ...devices['Desktop Chrome'], javaScriptEnabled: false, noscript: true },
    },
  ],
}
export default config
