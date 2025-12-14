import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'
import { test as base } from '@playwright/test'

export interface Fixtures extends TestingLibraryFixtures {
  noscript: boolean
}

export const test = base.extend<Fixtures>({
  ...fixtures,
  // Default value for noscript
  noscript: [false, { option: true }],
})
