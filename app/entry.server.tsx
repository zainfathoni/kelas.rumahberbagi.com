import type { EntryContext } from '@remix-run/node'
import { RemixServer } from '@remix-run/react'
import { renderToString } from 'react-dom/server'

// Start MSW mock server in E2E mode to intercept external API calls
if (process.env.RUNNING_E2E === 'true') {
  // Dynamic import to avoid bundling MSW in production
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('../mocks/server').startMockServer()
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  )

  responseHeaders.set('Content-Type', 'text/html')

  return new Response('<!DOCTYPE html>' + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  })
}
