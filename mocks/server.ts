import { setupServer } from 'msw/node'
import { mailgunHandlers } from './handlers'

export const server = setupServer(...mailgunHandlers)

/**
 * Start MSW server for intercepting HTTP requests.
 * Called when RUNNING_E2E=true to mock external APIs like Mailgun.
 */
export function startMockServer() {
  server.listen({ onUnhandledRequest: 'warn' })
  console.info('🔶 MSW mock server installed')
  console.info('🔶 Running in E2E mode - external API calls will be mocked')

  process.once('SIGINT', () => server.close())
  process.once('SIGTERM', () => server.close())
}

// Auto-start if this module is imported directly (for backward compatibility)
if (require.main === module) {
  startMockServer()
}
