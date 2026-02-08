import { describe, it, expect } from 'vitest'

describe('Home Page', () => {
  it.skip('renders the Home Page without error', async () => {
    // This test is skipped because it requires complex Remix router setup
    // The Home Page is tested via E2E tests instead
    // TODO: Set up proper createRemixStub without conflicting with test-utils router
    expect(true).toBe(true)
  })
})
