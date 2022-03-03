import { User } from '@prisma/client'
import { renderToString } from 'react-dom/server'
import type { SendEmailFunction } from 'remix-auth-email-link'
import * as emailProvider from '~/services/email-provider.server'
import { writeFixture } from '~/utils/fixtures'

export const sendEmail: SendEmailFunction<User> = async (options) => {
  const subject = 'Link login untuk Kelas Rumah Berbagi'
  const body = renderToString(
    <main>
      Halo {options.user?.name || 'pengguna baru'},<br />
      <br />
      <a href={options.magicLink}>
        Klik di sini untuk masuk ke kelas.rumahberbagi.com
      </a>
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

  if (
    process.env.RUNNING_E2E === 'true' ||
    process.env.NODE_ENV === 'development'
  ) {
    // TODO: Mock the HTTP transport layer properly by using MSW
    console.warn(`\n${options.magicLink}\n`)
    await writeFixture(`../e2e/fixtures/magic.local.json`, {
      magicLink: options.magicLink,
    })
  } else {
    await emailProvider.sendEmail({
      to: options.emailAddress,
      from: 'Rumah Berbagi <admin@rumahberbagi.com>',
      subject,
      html: body,
    })
  }
}
