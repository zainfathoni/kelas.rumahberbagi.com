import * as fs from 'fs'
import * as path from 'path'
import { User } from '@prisma/client'
import { renderToString } from 'react-dom/server'
import type { SendEmailFunction } from 'remix-auth-email-link'
import * as emailProvider from '~/services/email-provider.server'

let emailFrom = 'Rumah Berbagi <admin@rumahberbagi.com>'
if (process.env.EMAIL_FROM) {
  emailFrom = process.env.EMAIL_FROM
}

function getMagicLinkEmailDelivery() {
  const delivery = process.env.MAGIC_LINK_EMAIL_DELIVERY ?? 'mailgun'

  if (delivery !== 'mailgun' && delivery !== 'log' && delivery !== 'disabled') {
    throw new Error(`Unsupported MAGIC_LINK_EMAIL_DELIVERY: ${delivery}`)
  }

  if (process.env.STAGING_ENVIRONMENT === 'true' && delivery !== 'log') {
    throw new Error('Staging requires MAGIC_LINK_EMAIL_DELIVERY=log')
  }

  if (
    process.env.NODE_ENV === 'production' &&
    process.env.STAGING_ENVIRONMENT !== 'true' &&
    delivery === 'log'
  ) {
    throw new Error('MAGIC_LINK_EMAIL_DELIVERY=log is only allowed in staging')
  }

  return delivery
}

export const sendEmail: SendEmailFunction<User> = async (options) => {
  const subject = 'Link login untuk Kelas Rumah Berbagi'
  const siteHost = new URL(options.magicLink).host
  const body = renderToString(
    <main>
      Halo {options.user?.name || 'pengguna baru'},<br />
      <br />
      <a href={options.magicLink}>Klik di sini untuk masuk ke {siteHost}</a>
      <br />
      <p>
        Apabila bermasalah,{' '}
        <strong>
          <em>copy</em>
        </strong>{' '}
        pranala di bawah ini ini dan{' '}
        <strong>
          <em>paste</em>
        </strong>{' '}
        ke <em>address bar</em> di <em>browser</em> tempat Anda melakukan login.
      </p>
      <br />
      <code>{options.magicLink}</code>
    </main>
  )

  // In development, log the magic link for convenience.
  if (process.env.NODE_ENV === 'development') {
    console.info(`\n🔗 Magic link: ${options.magicLink}\n`)
  }

  // In E2E mode, write the magic link fixture directly for Playwright to read.
  // This replaces MSW interception which breaks when bundled by Remix's esbuild.
  if (process.env.RUNNING_E2E === 'true') {
    const fixturePath = path.join(
      process.cwd(),
      'e2e/fixtures/magic.local.json'
    )
    fs.writeFileSync(
      fixturePath,
      JSON.stringify({ magicLink: options.magicLink }, null, 2)
    )
    console.info('🔶 E2E: Captured magic link:', options.magicLink)
    return
  }

  // In staging, allow operators to inspect magic links without sending Mailgun
  // messages. This must be enabled explicitly so production behavior remains
  // unchanged.
  if (getMagicLinkEmailDelivery() === 'log') {
    console.info('🔶 Magic link email delivery disabled:', options.magicLink)
    return
  }

  if (getMagicLinkEmailDelivery() === 'disabled') {
    console.info('🔶 Magic link email delivery disabled')
    return
  }

  // Send email via Mailgun API
  await emailProvider.sendEmail({
    to: options.emailAddress,
    from: emailFrom,
    subject,
    html: body,
  })
}
