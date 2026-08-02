import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { User } from '@prisma/client'
import { sendEmail } from '../email.server'
import * as emailProvider from '~/services/email-provider.server'
import { userBuilder } from '~/models/__mocks__/user'

describe('sendEmail', () => {
  const user = userBuilder() as User
  const magicLink = 'http://localhost:3000/magic'

  function resetEmailEnv() {
    delete process.env.MAGIC_LINK_EMAIL_DELIVERY
    delete process.env.RUNNING_E2E
    delete process.env.STAGING_ENVIRONMENT
  }

  function sendMagicLink() {
    return sendEmail({
      emailAddress: user.email,
      magicLink,
      user,
      domainUrl: 'https://localhost:3000/',
      form: new FormData(),
    })
  }

  beforeEach(() => {
    resetEmailEnv()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    resetEmailEnv()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('call emailProvider.sendEmail method', async () => {
    const spy = vi
      .spyOn(emailProvider, 'sendEmail')
      .mockResolvedValue(new Response(null, { status: 200 }))

    await sendMagicLink()

    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: user.email,
        from: expect.any(String),
        subject: expect.any(String),
        html: expect.stringContaining('localhost:3000/magic'),
      })
    )
  })

  it('logs the magic link without calling emailProvider when delivery is log', async () => {
    process.env.MAGIC_LINK_EMAIL_DELIVERY = 'log'
    const sendSpy = vi.spyOn(emailProvider, 'sendEmail')
    const infoSpy = vi
      .spyOn(console, 'info')
      .mockImplementation(() => undefined)

    await sendMagicLink()

    expect(sendSpy).not.toHaveBeenCalled()
    expect(infoSpy).toHaveBeenCalledWith(
      '🔶 Magic link email delivery disabled:',
      magicLink
    )
  })

  it('disables delivery without logging the magic link', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    process.env.MAGIC_LINK_EMAIL_DELIVERY = 'disabled'
    const sendSpy = vi.spyOn(emailProvider, 'sendEmail')
    const infoSpy = vi
      .spyOn(console, 'info')
      .mockImplementation(() => undefined)

    await sendMagicLink()

    expect(sendSpy).not.toHaveBeenCalled()
    expect(infoSpy).toHaveBeenCalledWith(
      '🔶 Magic link email delivery disabled'
    )
    expect(JSON.stringify(infoSpy.mock.calls)).not.toContain(magicLink)
  })

  it('throws when the delivery mode is unsupported', async () => {
    process.env.MAGIC_LINK_EMAIL_DELIVERY = 'noop'
    const sendSpy = vi.spyOn(emailProvider, 'sendEmail')

    await expect(sendMagicLink()).rejects.toThrow(
      'Unsupported MAGIC_LINK_EMAIL_DELIVERY: noop'
    )
    expect(sendSpy).not.toHaveBeenCalled()
  })

  it('throws when log delivery is enabled in non-staging production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    process.env.MAGIC_LINK_EMAIL_DELIVERY = 'log'
    const sendSpy = vi.spyOn(emailProvider, 'sendEmail')

    await expect(sendMagicLink()).rejects.toThrow(
      'MAGIC_LINK_EMAIL_DELIVERY=log is only allowed in staging'
    )
    expect(sendSpy).not.toHaveBeenCalled()
  })

  it('throws when staging is configured to send through Mailgun', async () => {
    process.env.STAGING_ENVIRONMENT = 'true'
    process.env.MAGIC_LINK_EMAIL_DELIVERY = 'mailgun'
    const sendSpy = vi.spyOn(emailProvider, 'sendEmail')

    await expect(sendMagicLink()).rejects.toThrow(
      'Staging requires MAGIC_LINK_EMAIL_DELIVERY=log'
    )
    expect(sendSpy).not.toHaveBeenCalled()
  })

  it('fails when the email provider fails', async () => {
    vi.spyOn(emailProvider, 'sendEmail').mockRejectedValue(
      new Error('Mailgun email delivery failed with 429')
    )

    await expect(sendMagicLink()).rejects.toThrow(
      'Mailgun email delivery failed with 429'
    )
  })
})

describe('Mailgun email provider', () => {
  const message = {
    to: 'member@rumahberbagi.test',
    from: 'Rumah Berbagi <admin@rumahberbagi.com>',
    subject: 'Link login untuk Kelas Rumah Berbagi',
    html: '<a href="https://kelas.rumahberbagi.test/magic?token=secret-token">Login</a>',
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns successful Mailgun responses', async () => {
    const response = new Response('{"id":"message-id"}', { status: 200 })
    const fetch = vi.fn().mockResolvedValue(response)
    vi.stubGlobal('fetch', fetch)

    await expect(emailProvider.sendEmail(message)).resolves.toBe(response)
    expect(fetch).toHaveBeenCalledOnce()
  })

  it('throws and logs sanitized context for failed Mailgun responses', async () => {
    const apiKey = 'key-some-mailgun-key'
    const encodedApiKey = Buffer.from(`api:${apiKey}`).toString('base64')
    const encodedRecipient = encodeURIComponent(message.to)
    const encodedMagicLinkToken = encodeURIComponent('token=secret-token')
    const echoedRequestBody = new URLSearchParams(message).toString()
    const malformedPercentEncoding = 'bad%ZZ'
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            message: `Monthly limit reached for ${message.to} at https://kelas.rumahberbagi.test/magic?token=secret-token`,
            echoedRequestBody,
            malformedPercentEncoding,
          }),
          {
            status: 429,
            statusText: 'Too Many Requests',
            headers: { 'content-type': 'application/json' },
          }
        )
      )
    )

    await expect(emailProvider.sendEmail(message)).rejects.toThrow(
      'Mailgun email delivery failed with 429'
    )

    expect(consoleError).toHaveBeenCalledWith('Mailgun email delivery failed', {
      response: {
        status: 429,
        statusText: 'Too Many Requests',
        contentType: 'application/json',
        body: expect.stringContaining('[redacted-email]'),
      },
    })
    const logOutput = JSON.stringify(consoleError.mock.calls)
    expect(logOutput).toContain('[redacted-url]')
    expect(logOutput).not.toContain('member@rumahberbagi.test')
    expect(logOutput).not.toContain(encodedRecipient)
    expect(logOutput).not.toContain('secret-token')
    expect(logOutput).not.toContain(encodedMagicLinkToken)
    expect(logOutput).not.toContain(apiKey)
    expect(logOutput).not.toContain(encodedApiKey)
  })
})
