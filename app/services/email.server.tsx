// app/services/email.server.tsx
import { User } from '@prisma/client'
import { renderToString } from 'react-dom/server'
import type { KCDSendEmailFunction } from 'remix-auth'
import * as emailProvider from '~/services/email-provider.server'

export let sendEmail: KCDSendEmailFunction<User> = async (options) => {
  let subject = "Here's your Magic sign-in link"
  let body = renderToString(
    <p>
      Hi {options.user?.name || 'there'},<br />
      <br />
      <a href={options.magicLink}>Click here to login on example.app</a>
    </p>
  )

  await emailProvider.sendEmail(options.emailAddress, subject, body)
}
