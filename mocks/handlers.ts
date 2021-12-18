import { rest } from 'msw'

export const mailgunHandlers = [
  rest.post('https://api.mailgun.net/v3/:domain/messages', async (req, res, ctx) => {
    const body = Object.fromEntries(new URLSearchParams(req.body?.toString()))
    console.info('🔶 mocked email contents:', body)

    const randomId = '20210321210543.1.E01B8B612C44B41B'
    const id = `<${randomId}>@${req.params.domain}`
    return res(ctx.json({ id, message: 'Queued. Thank you.' }))
  }),
]
