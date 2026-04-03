import { beforeEach, describe, expect, it, vi } from 'vitest'
import { redirect } from '@remix-run/node'
import { loader } from '../dashboard.purchase.verify'
import { TRANSACTION_STATUS } from '~/models/enum'
import { requireUser } from '~/services/auth.server'
import { getFirstTransaction } from '~/models/transaction'

vi.mock('~/services/auth.server', () => ({
  requireUser: vi.fn(),
}))

vi.mock('~/models/transaction', () => ({
  getFirstTransaction: vi.fn(),
}))

function buildRequest(url = 'http://example.com/dashboard/purchase/verify') {
  return new Request(url, { method: 'GET' })
}

const fakeUser = { id: 'user-1', email: 'test@example.com' }

describe('dashboard.purchase.verify loader', () => {
  beforeEach(() => {
    vi.mocked(requireUser).mockResolvedValue(fakeUser as never)
  })

  it('redirects to /dashboard/purchase when no transaction exists', async () => {
    vi.mocked(getFirstTransaction).mockResolvedValue(null)

    const response = await loader({
      request: buildRequest(),
      params: {},
      context: {},
    })

    expect(response).toEqual(redirect('/dashboard/purchase'))
  })

  it('redirects to /dashboard/purchase/completed when transaction is VERIFIED', async () => {
    vi.mocked(getFirstTransaction).mockResolvedValue({
      id: 'tx-1',
      status: TRANSACTION_STATUS.VERIFIED,
    } as never)

    const response = await loader({
      request: buildRequest(),
      params: {},
      context: {},
    })

    expect(response).toEqual(redirect('/dashboard/purchase/completed'))
  })

  it('returns transaction and user when transaction is not verified', async () => {
    const fakeTransaction = {
      id: 'tx-1',
      status: TRANSACTION_STATUS.CREATED,
    }
    vi.mocked(getFirstTransaction).mockResolvedValue(fakeTransaction as never)

    const response = await loader({
      request: buildRequest(),
      params: {},
      context: {},
    })

    expect(response).toEqual({ transaction: fakeTransaction, user: fakeUser })
  })
})
