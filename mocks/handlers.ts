import * as fs from 'fs'
import * as path from 'path'
import { http, HttpResponse } from 'msw'

// Path to store the magic link for E2E tests to read
const MAGIC_LINK_FIXTURE_PATH = path.join(
  __dirname,
  '../e2e/fixtures/magic.local.json'
)

/**
 * Extract magic link from email HTML content.
 * The magic link is the href of the first anchor tag.
 */
function extractMagicLink(html: string): string | null {
  const match = html.match(/href="([^"]*magic[^"]*)"/)
  return match ? match[1] : null
}

export const mailgunHandlers = [
  http.post(
    'https://api.mailgun.net/v3/:domain/messages',
    async ({ request, params }) => {
      const body = Object.fromEntries(new URLSearchParams(await request.text()))
      console.info('🔶 MSW intercepted email request:', {
        to: body.to,
        subject: body.subject,
      })

      // Extract and save magic link for E2E tests
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
  ),
]
