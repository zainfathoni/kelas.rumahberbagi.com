import { User } from '@prisma/client'
import { sendEmail } from '../email.server'
import { userBuilder } from '~/models/__mocks__/user'

describe('sendEmail', () => {
  const user = userBuilder() as User

  it('call emailProvider.sendEmail method', async () => {
    await sendEmail({
      emailAddress: user.email,
      magicLink: 'http://localhost:3000/magic',
      user,
      domainUrl: 'https://localhost:3000/',
      form: new FormData(),
    })

    // TODO: assert emailProvider.sendEmail was called
  })
})
