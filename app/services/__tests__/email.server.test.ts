import { vi, describe, it, expect, beforeEach } from 'vitest'
import { User } from '@prisma/client'
import { sendEmail } from '../email.server'
import * as emailProvider from '~/services/email-provider.server'
import { userBuilder } from '~/models/__mocks__/user'

describe('sendEmail', () => {
  const user = userBuilder() as User

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('call emailProvider.sendEmail method', async () => {
    const spy = vi.spyOn(emailProvider, 'sendEmail')

    await sendEmail({
      emailAddress: user.email,
      magicLink: 'http://localhost:3000/magic',
      user,
      domainUrl: 'https://localhost:3000/',
      form: new FormData(),
    })

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
})
