import { createRemixStub as createStub } from '@remix-run/testing'
import {
  render as rtlRender,
  RenderOptions,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { ReactElement } from 'react'

/**
 * Creates a wrapper for testing components that use Remix's Link or other router-dependent features.
 * Uses createRemixStub from @remix-run/testing for proper router context.
 */
export function createRemixStubWrapper(
  ui: ReactElement,
  initialEntries = ['/']
) {
  const RemixStub = createStub([
    {
      path: '*',
      Component: () => ui,
    },
  ])
  return <RemixStub initialEntries={initialEntries} />
}

/**
 * Custom render function that wraps components with Remix router context.
 */
export function render(
  ui: ReactElement,
  {
    initialEntries = ['/'],
    ...options
  }: RenderOptions & { initialEntries?: string[] } = {}
) {
  return rtlRender(createRemixStubWrapper(ui, initialEntries), options)
}

// Re-export commonly used testing-library utilities
export { screen, waitFor, within }
