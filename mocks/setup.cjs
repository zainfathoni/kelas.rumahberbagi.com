/**
 * MSW v2 preload script for E2E tests.
 *
 * MSW v2 interceptors must run as native Node modules — they break when
 * bundled by esbuild (Remix server build). Loading via --require ensures
 * interceptors are installed before the Remix server boots.
 */
if (process.env.RUNNING_E2E === 'true') {
  const { setupServer } = require('msw/node')
  const { http, HttpResponse } = require('msw')
  const fs = require('fs')
  const path = require('path')

  const MAGIC_LINK_FIXTURE_PATH = path.join(
    __dirname,
    '../e2e/fixtures/magic.local.json'
  )

  function extractMagicLink(html) {
    const match = html.match(/href="([^"]*magic[^"]*)"/)
    return match ? match[1] : null
  }

  const server = setupServer(
    http.post(
      'https://api.mailgun.net/v3/:domain/messages',
      async ({ request, params }) => {
        const body = Object.fromEntries(
          new URLSearchParams(await request.text())
        )
        console.info('🔶 MSW intercepted email request:', {
          to: body.to,
          subject: body.subject,
        })

        if (body.html) {
          const magicLink = extractMagicLink(body.html)
          if (magicLink) {
            console.info('🔶 Captured magic link:', magicLink)
            fs.writeFileSync(
              MAGIC_LINK_FIXTURE_PATH,
              JSON.stringify({ magicLink }, null, 2)
            )
          }
        }

        const randomId = '20210321210543.1.E01B8B612C44B41B'
        const id = `<${randomId}>@${String(params.domain)}`
        return HttpResponse.json({ id, message: 'Queued. Thank you.' })
      }
    )
  )

  server.listen({ onUnhandledRequest: 'warn' })
  console.info('🔶 MSW mock server installed (via --require preload)')

  process.once('SIGINT', () => server.close())
  process.once('SIGTERM', () => server.close())
}
