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

function bestEffortDecodeUrlEncodedText(body: string) {
  return body.replace(/\+/g, ' ').replace(/(?:%[0-9a-fA-F]{2})+/g, (part) => {
    try {
      return decodeURIComponent(part)
    } catch {
      return part
    }
  })
}

function sanitizeMailgunResponseBody(body: string) {
  return bestEffortDecodeUrlEncodedText(body)
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[redacted-email]')
    .replace(/https?:\/\/\S+/gi, '[redacted-url]')
    .replace(/\b(token|secret)=([^&\s"'<>]+)/gi, '$1=[redacted]')
    .slice(0, 500)
}

async function getSafeResponseSummary(response: Response) {
  const contentType = response.headers.get('content-type') ?? 'unknown'
  let responseBody = ''

  try {
    responseBody = sanitizeMailgunResponseBody(await response.text())
  } catch {
    responseBody = '[unavailable]'
  }

  return {
    status: response.status,
    statusText: response.statusText,
    contentType,
    body: responseBody,
  }
}

export async function sendEmail({ to, from, subject, html }: MailgunMessage) {
  const auth = `${Buffer.from(`api:${mailgunSendingKey}`).toString('base64')}`

  const body = new URLSearchParams({
    to,
    from,
    subject,
    html,
  })

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

  if (!response.ok) {
    console.error('Mailgun email delivery failed', {
      response: await getSafeResponseSummary(response),
    })

    throw new Error(`Mailgun email delivery failed with ${response.status}`)
  }

  return response
}
