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
  })

  it('call emailProvider.sendEmail method', async () => {
    const spy = vi.spyOn(emailProvider, 'sendEmail')

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
})
