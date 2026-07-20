import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { loader } from '../magic'
import { getUserByEmail } from '~/models/user'
import { auth, getHeadersWithUpdatedUser } from '~/services/auth.server'
import { getUserSession } from '~/services/session.server'

vi.mock('~/models/user', () => ({ getUserByEmail: vi.fn() }))
vi.mock('~/services/auth.server', () => ({
  auth: { authenticate: vi.fn() },
  getHeadersWithUpdatedUser: vi.fn(),
}))
vi.mock('~/services/session.server', () => ({ getUserSession: vi.fn() }))

const originalRunningE2E = process.env.RUNNING_E2E
const originalOrbPortal = process.env.ORB_PORTAL
const originalNodeEnv = process.env.NODE_ENV

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name]
  else process.env[name] = value
}

function loadMagic(email = 'admin@rumahberbagi.com') {
  return loader({
    request: new Request(
      `http://localhost:3000/magic?previewEmail=${encodeURIComponent(email)}`
    ),
    params: {},
    context: {},
  } as never) as Promise<Response>
}

describe('magic route preview authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.RUNNING_E2E
    delete process.env.ORB_PORTAL
    process.env.NODE_ENV = 'test'
    vi.mocked(getUserSession).mockResolvedValue({ get: vi.fn() } as never)
    vi.mocked(auth.authenticate).mockResolvedValue(new Response() as never)
  })

  afterEach(() => {
    restoreEnv('RUNNING_E2E', originalRunningE2E)
    restoreEnv('ORB_PORTAL', originalOrbPortal)
    restoreEnv('NODE_ENV', originalNodeEnv)
  })

  it.each([
    ['E2E mode alone', 'RUNNING_E2E'],
    ['Orb Portal mode alone', 'ORB_PORTAL'],
  ])('does not enable preview login with %s', async (_label, envName) => {
    process.env[envName] = 'true'

    await loadMagic()

    expect(getUserByEmail).not.toHaveBeenCalled()
    expect(auth.authenticate).toHaveBeenCalledOnce()
  })

  it('does not enable preview login in production with both flags', async () => {
    process.env.NODE_ENV = 'production'
    process.env.RUNNING_E2E = 'true'
    process.env.ORB_PORTAL = 'true'

    await loadMagic()

    expect(getUserByEmail).not.toHaveBeenCalled()
    expect(auth.authenticate).toHaveBeenCalledOnce()
  })

  it('authenticates a seeded preview user only when both flags are enabled', async () => {
    process.env.RUNNING_E2E = 'true'
    process.env.ORB_PORTAL = 'true'
    const user = { id: 'admin-id', email: 'admin@rumahberbagi.com' }
    vi.mocked(getUserByEmail).mockResolvedValue(user as never)
    vi.mocked(getHeadersWithUpdatedUser).mockResolvedValue(
      new Headers({ 'Set-Cookie': '_session=preview' })
    )

    const response = await loadMagic()

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('/dashboard')
    expect(response.headers.get('Set-Cookie')).toBe('_session=preview')
    expect(getUserByEmail).toHaveBeenCalledWith('admin@rumahberbagi.com')
    expect(auth.authenticate).not.toHaveBeenCalled()
  })

  it('does not allow arbitrary database users through preview login', async () => {
    process.env.RUNNING_E2E = 'true'
    process.env.ORB_PORTAL = 'true'

    await loadMagic('other@rumahberbagi.com')

    expect(getUserByEmail).not.toHaveBeenCalled()
    expect(auth.authenticate).toHaveBeenCalledOnce()
  })
})
