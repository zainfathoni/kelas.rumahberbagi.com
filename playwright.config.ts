import { PlaywrightTestConfig, devices } from '@playwright/test'
import { Fixtures } from './e2e/base-test'

const config: PlaywrightTestConfig<Fixtures> = {
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    /* TODO: Test mobile browsers
    // "Pixel 4" tests use Chromium browser.
    {
      name: 'Pixel 4',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 4'],
      },
    },
    // "iPhone 11" tests use WebKit browser.
    {
      name: 'iPhone 11',
      use: {
        browserName: 'webkit',
        ...devices['iPhone 11'],
      },
    },
    */
    // Desktop tests use Firefox browser.
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    // Desktop tests use Safari browser.
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Desktop tests use Chromium browser with JavaScript disabled.
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
