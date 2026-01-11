import {
  locatorFixtures,
  LocatorFixtures,
} from '@playwright-testing-library/test/fixture'
import { test as base, expect } from '@playwright/test'

export interface Fixtures extends LocatorFixtures {
  noscript: boolean
}

export const test = base.extend<Fixtures>({
  ...locatorFixtures,
  // Default value for noscript
  noscript: [false, { option: true }],
})

// Re-export expect for convenience
export { expect }
