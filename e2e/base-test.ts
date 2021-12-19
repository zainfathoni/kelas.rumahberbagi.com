import { test as base } from '@playwright/test'
import { fixtures, TestingLibraryFixtures } from '@playwright-testing-library/test/fixture'

interface Fixtures extends TestingLibraryFixtures {
  noscript: boolean
}

export const test = base.extend<Fixtures>({
  ...fixtures,
  // Default value for the person.
  noscript: false,
})
