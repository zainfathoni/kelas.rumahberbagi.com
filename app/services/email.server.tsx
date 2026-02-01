import { User } from '@prisma/client'
import { renderToString } from 'react-dom/server'
import type { SendEmailFunction } from 'remix-auth-email-link'
import * as emailProvider from '~/services/email-provider.server'

let emailFrom = 'Rumah Berbagi <admin@rumahberbagi.com>'
if (process.env.EMAIL_FROM) {
  emailFrom = process.env.EMAIL_FROM
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

  // In E2E mode, MSW intercepts the Mailgun API call and captures the magic link.
  // In development, we log the magic link for convenience.
  if (process.env.NODE_ENV === 'development') {
    console.info(`\n🔗 Magic link: ${options.magicLink}\n`)
  }

  // Send email via Mailgun API - MSW will intercept in E2E mode
  await emailProvider.sendEmail({
    to: options.emailAddress,
    from: emailFrom,
    subject,
    html: body,
  })
}
