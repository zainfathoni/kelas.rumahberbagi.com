import { sendEmail } from '../email.server'

describe('sendEmail', () => {
  it('call emailProvider.sendEmail method', async () => {
    await sendEmail({
      emailAddress: 'me@zainf.dev',
      magicLink: 'http://localhost:3000/magic',
      user: null,
      domainUrl: 'https://localhost:3000/',
    })

    // TODO: assert emailProvider.sendEmail was called
  })
})
