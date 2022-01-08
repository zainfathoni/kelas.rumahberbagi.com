let mailgunDomain = 'some.domain.com'
if (process.env.MAILGUN_DOMAIN) {
  mailgunDomain = process.env.MAILGUN_DOMAIN
} else if (process.env.NODE_ENV === 'production') {
  throw new Error('MAILGUN_DOMAIN is required')
}

let mailgunSendingKey = 'key-some-mailgun-key'
if (process.env.MAILGUN_SENDING_KEY) {
  mailgunSendingKey = process.env.MAILGUN_SENDING_KEY
} else if (process.env.NODE_ENV === 'production') {
  throw new Error('MAILGUN_SENDING_KEY is required')
}

type MailgunMessage = {
  to: string
  from: string
  subject: string
  html: string
}

export async function sendEmail({ to, from, subject, html }: MailgunMessage) {
  const auth = `${Buffer.from(`api:${mailgunSendingKey}`).toString('base64')}`

  const body = new URLSearchParams({
    to,
    from,
    subject,
    html,
  })

  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve(body)
  }
  const response = await fetch(
    `https://api.mailgun.net/v3/${mailgunDomain}/messages`,
    {
      method: 'post',
      body,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  )

  return response
}
