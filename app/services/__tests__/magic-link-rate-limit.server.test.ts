import { beforeEach, describe, expect, it, vi } from 'vitest'

const { count, create, transaction } = vi.hoisted(() => ({
  count: vi.fn(),
  create: vi.fn(),
  transaction: vi.fn(),
}))

vi.mock('~/utils/db.server', () => ({
  db: {
    $transaction: transaction,
  },
}))

import {
  enforceMagicLinkRateLimit,
  MAGIC_LINK_RATE_LIMIT_MESSAGE,
} from '../magic-link-rate-limit.server'

describe('enforceMagicLinkRateLimit', () => {
  const now = new Date('2026-07-02T10:00:00.000Z')

  beforeEach(() => {
    vi.clearAllMocks()
    transaction.mockImplementation((callback) =>
      callback({ auditLog: { count, create } })
    )
    create.mockResolvedValue({})
  })

  it('allows an occasional magic-link request and records email and IP scopes', async () => {
    count.mockResolvedValue(0)

    await enforceMagicLinkRateLimit(
      createRequest('User@RumahBerbagi.test', '203.0.113.10'),
      now
    )

    expect(create).toHaveBeenCalledTimes(2)
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        entityId: 'email:user@rumahberbagi.test',
        createdAt: now,
        metadata: JSON.stringify({ email: 'user@rumahberbagi.test' }),
        ipAddress: '203.0.113.10',
      }),
    })
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        entityId: 'ip:203.0.113.10',
      }),
    })
  })

  it('allows the boundary attempt before email and IP limits are reached', async () => {
    count
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(9)
      .mockResolvedValueOnce(19)

    await enforceMagicLinkRateLimit(
      createRequest('member@rumahberbagi.test', '203.0.113.10'),
      now
    )

    expect(create).toHaveBeenCalledTimes(2)
  })

  it('blocks an email after three requests in the short window', async () => {
    count.mockResolvedValueOnce(3)

    await expect(
      enforceMagicLinkRateLimit(
        createRequest('member@rumahberbagi.test', '203.0.113.10'),
        now
      )
    ).rejects.toThrow(MAGIC_LINK_RATE_LIMIT_MESSAGE)

    expect(create).not.toHaveBeenCalled()
  })

  it('blocks an obvious IP burst after twenty requests in the short window', async () => {
    count
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(20)

    await expect(
      enforceMagicLinkRateLimit(
        createRequest('other@rumahberbagi.test', '203.0.113.10'),
        now
      )
    ).rejects.toThrow(MAGIC_LINK_RATE_LIMIT_MESSAGE)

    expect(create).not.toHaveBeenCalled()
  })
})

function createRequest(email: string, ip: string) {
  const form = new URLSearchParams({ email })

  return new Request('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'x-forwarded-for': `${ip}, 10.0.0.1`,
    },
    body: form,
  })
}
