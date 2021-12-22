import { test as base } from '@playwright/test'
import {
  fixtures,
  TestingLibraryFixtures,
} from '@playwright-testing-library/test/fixture'

export interface Fixtures extends TestingLibraryFixtures {
  noscript: boolean
}

export const test = base.extend<Fixtures>({
  ...fixtures,
  // Default value for noscript
  noscript: false,
})
