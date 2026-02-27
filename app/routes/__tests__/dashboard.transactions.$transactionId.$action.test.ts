import { beforeEach, describe, expect, it, vi } from 'vitest'
import { action } from '../dashboard.transactions.$transactionId.$action'
import { TRANSACTION_STATUS } from '~/models/enum'
import { requireUser } from '~/services/auth.server'
import { getFirstCourse } from '~/models/course'
import { requireCourseAuthor } from '~/utils/permissions'
import {
  getTransactionById,
  updateTransactionStatus,
} from '~/models/transaction'
import {
  activateSubscription,
  deactivateSubscription,
} from '~/models/subscription'

vi.mock('~/services/auth.server', () => ({
  requireUser: vi.fn(),
}))

vi.mock('~/models/course', () => ({
  getFirstCourse: vi.fn(),
}))

vi.mock('~/utils/permissions', () => ({
  requireCourseAuthor: vi.fn(),
}))

vi.mock('~/models/transaction', () => ({
  getTransactionById: vi.fn(),
  updateTransactionStatus: vi.fn(),
}))

vi.mock('~/models/subscription', () => ({
  activateSubscription: vi.fn(),
  deactivateSubscription: vi.fn(),
}))

function buildRequest(status: string, notes = 'Catatan verifikasi') {
  const formData = new URLSearchParams({ status, notes })

  return new Request(
    'http://localhost:3000/dashboard/transactions/tx-1/verify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    }
  )
}

async function runAction(status: string) {
  return action({
    request: buildRequest(status),
    params: { transactionId: 'tx-1' },
    context: {},
  } as never)
}

describe('dashboard.transactions.$transactionId.$action action', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.mocked(requireUser).mockResolvedValue({ id: 'author-1' } as never)
    vi.mocked(getFirstCourse).mockResolvedValue({ id: 'course-1' } as never)
    vi.mocked(requireCourseAuthor).mockReturnValue(true)
    vi.mocked(getTransactionById).mockResolvedValue({
      id: 'tx-1',
      status: TRANSACTION_STATUS.SUBMITTED,
      userId: 'user-1',
    } as never)
    vi.mocked(updateTransactionStatus).mockResolvedValue({
      id: 'tx-1',
      status: TRANSACTION_STATUS.VERIFIED,
      userId: 'user-1',
    } as never)
    vi.mocked(activateSubscription).mockResolvedValue({ id: 'sub-1' } as never)
    vi.mocked(deactivateSubscription).mockResolvedValue({
      id: 'sub-1',
    } as never)
  })

  it('rejects tampered status payloads that are outside allowlist', async () => {
    try {
      await runAction(TRANSACTION_STATUS.SUBMITTED)
      throw new Error('Expected action to throw Response')
    } catch (error) {
      expect(error).toBeInstanceOf(Response)
      const response = error as Response
      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toBe(
        'Status transaksi tidak valid.'
      )
    }

    expect(updateTransactionStatus).not.toHaveBeenCalled()
  })

  it('rejects forbidden transition from VERIFIED to REJECTED', async () => {
    vi.mocked(getTransactionById).mockResolvedValue({
      id: 'tx-1',
      status: TRANSACTION_STATUS.VERIFIED,
      userId: 'user-1',
    } as never)

    try {
      await runAction(TRANSACTION_STATUS.REJECTED)
      throw new Error('Expected action to throw Response')
    } catch (error) {
      expect(error).toBeInstanceOf(Response)
      const response = error as Response
      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toBe(
        'Transaksi yang sudah diverifikasi tidak dapat diubah menjadi ditolak.'
      )
    }

    expect(updateTransactionStatus).not.toHaveBeenCalled()
  })

  it('accepts VERIFIED status and updates transaction', async () => {
    const response = await runAction(TRANSACTION_STATUS.VERIFIED)

    expect(response).toBeInstanceOf(Response)
    if (!(response instanceof Response)) throw new Error('Expected Response')
    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe(
      '/dashboard/transactions/tx-1'
    )
    expect(updateTransactionStatus).toHaveBeenCalledWith(
      'tx-1',
      'Catatan verifikasi',
      TRANSACTION_STATUS.VERIFIED
    )
  })
})
