import { beforeEach, describe, expect, it, vi } from 'vitest'
import { action, loader } from '../login'
import { auth } from '~/services/auth.server'
import * as emailProvider from '~/services/email-provider.server'
import {
  enforceMagicLinkRateLimit,
  MAGIC_LINK_RATE_LIMIT_MESSAGE,
} from '~/services/magic-link-rate-limit.server'

vi.mock('~/services/auth.server', () => ({
  auth: {
    authenticate: vi.fn(),
    isAuthenticated: vi.fn(),
    sessionErrorKey: 'auth:error',
  },
}))

vi.mock('~/services/magic-link-rate-limit.server', () => ({
  enforceMagicLinkRateLimit: vi.fn(),
  MAGIC_LINK_RATE_LIMIT_MESSAGE:
    'Terlalu banyak permintaan link login. Silakan coba lagi nanti.',
}))

function getSetCookie(response: Response) {
  const cookie = response.headers.get('Set-Cookie')
  if (!cookie) throw new Error('Expected Set-Cookie header')
  return cookie
}

async function loadLogin() {
  const response = (await loader({
    request: new Request('http://localhost:3000/login?redirectTo=/dashboard'),
    params: {},
    context: {},
  } as never)) as Response

  const data = (await response.json()) as { loginNonce: string }

  return {
    cookie: getSetCookie(response),
    nonce: data.loginNonce,
  }
}

function postLogin({ cookie, nonce }: { cookie?: string; nonce?: string }) {
  const body = new URLSearchParams({ email: 'user@rumahberbagi.test' })
  if (nonce) body.set('loginNonce', nonce)

  return action({
    request: new Request('http://localhost:3000/login?redirectTo=/dashboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body,
    }),
    params: {},
    context: {},
  } as never)
}

describe('login route nonce', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
    vi.mocked(auth.isAuthenticated).mockResolvedValue(null as never)
    vi.mocked(enforceMagicLinkRateLimit).mockResolvedValue(undefined)
  })

  it('blocks direct POSTs without a nonce before email authentication can send Mailgun email', async () => {
    const sendEmail = vi.spyOn(emailProvider, 'sendEmail')

    const response = (await postLogin({})) as Response

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe(
      '/login?redirectTo=%2Fdashboard'
    )
    expect(auth.authenticate).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('blocks POSTs with an invalid nonce before email authentication can send Mailgun email', async () => {
    const sendEmail = vi.spyOn(emailProvider, 'sendEmail')
    const { cookie } = await loadLogin()

    const response = (await postLogin({
      cookie,
      nonce: 'not-the-session-nonce',
    })) as Response

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe(
      '/login?redirectTo=%2Fdashboard'
    )
    expect(auth.authenticate).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })

  it('allows a browser POST with the session-backed nonce to request a magic link', async () => {
    const { cookie, nonce } = await loadLogin()
    vi.mocked(enforceMagicLinkRateLimit).mockImplementation(async (request) => {
      const form = await request.formData()

      expect(form.get('email')).toBe('user@rumahberbagi.test')
      expect(form.get('loginNonce')).toBe(nonce)
    })
    vi.mocked(auth.authenticate).mockImplementation(
      async (_strategy, request) => {
        const body = await (request as Request).text()

        expect(body).toContain('email=user%40rumahberbagi.test')
        expect(body).toContain(`loginNonce=${nonce}`)

        return null as never
      }
    )

    await postLogin({ cookie, nonce })

    expect(enforceMagicLinkRateLimit).toHaveBeenCalledOnce()
    expect(auth.authenticate).toHaveBeenCalledOnce()
    expect(auth.authenticate).toHaveBeenCalledWith(
      'email-link',
      expect.any(Request),
      {
        successRedirect: '/login?redirectTo=%2Fdashboard',
        failureRedirect: '/login?redirectTo=%2Fdashboard',
      }
    )
  })

  it('blocks a nonce-valid POST when rate limited before email authentication can send Mailgun email', async () => {
    const sendEmail = vi.spyOn(emailProvider, 'sendEmail')
    const { cookie, nonce } = await loadLogin()
    vi.mocked(enforceMagicLinkRateLimit).mockRejectedValue(
      new Error(MAGIC_LINK_RATE_LIMIT_MESSAGE)
    )

    const response = (await postLogin({ cookie, nonce })) as Response

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe(
      '/login?redirectTo=%2Fdashboard'
    )
    expect(enforceMagicLinkRateLimit).toHaveBeenCalledOnce()
    expect(auth.authenticate).not.toHaveBeenCalled()
    expect(sendEmail).not.toHaveBeenCalled()
  })
})
