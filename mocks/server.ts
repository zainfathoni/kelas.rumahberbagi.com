import { setupServer } from 'msw/node'
import { mailgunHandlers } from './handlers'

export const server = setupServer(...mailgunHandlers)

server.listen({ onUnhandledRequest: 'warn' })
console.info('🔶 Mock server installed')
console.info('running in E2E mode')

process.once('SIGINT', () => server.close())
process.once('SIGTERM', () => server.close())
