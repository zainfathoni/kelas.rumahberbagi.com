import { afterEach, describe, expect, it, vi } from 'vitest'

const originalOrbPortal = process.env.ORB_PORTAL
const originalNodeEnv = process.env.NODE_ENV
const originalSessionSecret = process.env.SESSION_SECRET

async function createSessionCookie({
  nodeEnv = 'test',
  orbPortal = false,
}: {
  nodeEnv?: typeof process.env.NODE_ENV
  orbPortal?: boolean
} = {}) {
  vi.resetModules()
  process.env.NODE_ENV = nodeEnv
  process.env.SESSION_SECRET = 'session-secret-test-value'
  if (orbPortal) process.env.ORB_PORTAL = 'true'
  else delete process.env.ORB_PORTAL

  const { sessionStorage } = await vi.importActual<
    typeof import('../session.server')
  >('../session.server')
  return sessionStorage.commitSession(await sessionStorage.getSession())
}

describe('session cookie', () => {
  afterEach(() => {
    if (originalOrbPortal === undefined) delete process.env.ORB_PORTAL
    else process.env.ORB_PORTAL = originalOrbPortal
    process.env.NODE_ENV = originalNodeEnv
    if (originalSessionSecret === undefined) delete process.env.SESSION_SECRET
    else process.env.SESSION_SECRET = originalSessionSecret
    vi.resetModules()
  })

  it('uses a partitioned cross-site secure cookie in an Orb Portal', async () => {
    const cookie = await createSessionCookie({ orbPortal: true })

    expect(cookie).toContain('Secure')
    expect(cookie).toContain('Partitioned')
    expect(cookie).toContain('SameSite=None')
  })

  it('keeps the default same-site cookie outside an Orb Portal', async () => {
    const cookie = await createSessionCookie()

    expect(cookie).toContain('SameSite=Lax')
    expect(cookie).not.toContain('Partitioned')
  })

  it('uses a secure non-partitioned cookie in normal production', async () => {
    const cookie = await createSessionCookie({ nodeEnv: 'production' })

    expect(cookie).toContain('Secure')
    expect(cookie).toContain('SameSite=Lax')
    expect(cookie).not.toContain('Partitioned')
  })
})
