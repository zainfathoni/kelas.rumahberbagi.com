// my-test.ts
import { test as base } from '@playwright/test'

export type TestOptions = {
  noscript: boolean
}

export const test = base.extend<TestOptions>({
  // Default value for the person.
  noscript: false,
})
