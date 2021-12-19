import { User } from '@prisma/client'
import { renderToString } from 'react-dom/server'
import type { KCDSendEmailFunction } from 'remix-auth'
import * as emailProvider from '~/services/email-provider.server'

export let sendEmail: KCDSendEmailFunction<User> = async (options) => {
  let subject = 'Link login untuk Kelas Rumah Berbagi'
  let body = renderToString(
    <p>
      Halo {options.user?.name || 'pengguna baru'},<br />
      <br />
      <a href={options.magicLink}>Klik di sini untuk masuk ke kelas.rumahberbagi.com</a>
    </p>
  )

  if (process.env.NODE_ENV === 'development') {
    // TODO: Mock the HTTP transport layer properly by using MSW
    console.log(options.magicLink)
  } else {
    await emailProvider.sendEmail({
      to: options.emailAddress,
      from: 'Rumah Berbagi <admin@rumahberbagi.com>',
      subject,
      html: body,
    })
  }
}
