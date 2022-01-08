import { User } from '@prisma/client'
import { renderToString } from 'react-dom/server'
import type { KCDSendEmailFunction } from 'remix-auth'
import * as emailProvider from '~/services/email-provider.server'
import { writeFixture } from '~/utils/fixtures'

export const sendEmail: KCDSendEmailFunction<User> = async (options) => {
  const subject = 'Link login untuk Kelas Rumah Berbagi'
  const body = renderToString(
    <p>
      Halo {options.user?.name || 'pengguna baru'},<br />
      <br />
      <a href={options.magicLink}>
        Klik di sini untuk masuk ke kelas.rumahberbagi.com
      </a>
    </p>
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
