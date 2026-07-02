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
      .mockResolvedValueOnce(3)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(20)

    await enforceMagicLinkRateLimit(
      createRequest('member@rumahberbagi.test', '203.0.113.10'),
      now
    )

    expect(create).toHaveBeenCalledTimes(2)
  })

  it('blocks an email after three previous requests in the short window', async () => {
    count.mockResolvedValueOnce(4)

    await expect(
      enforceMagicLinkRateLimit(
        createRequest('member@rumahberbagi.test', '203.0.113.10'),
        now
      )
    ).rejects.toThrow(MAGIC_LINK_RATE_LIMIT_MESSAGE)

    expect(create).toHaveBeenCalledTimes(2)
  })

  it('blocks an email after ten previous requests in the daily window', async () => {
    count.mockResolvedValueOnce(1).mockResolvedValueOnce(11)

    await expect(
      enforceMagicLinkRateLimit(
        createRequest('member@rumahberbagi.test', '203.0.113.10'),
        now
      )
    ).rejects.toThrow(MAGIC_LINK_RATE_LIMIT_MESSAGE)

    expect(create).toHaveBeenCalledTimes(2)
  })

  it('blocks an obvious IP burst after twenty requests in the short window', async () => {
    count
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(21)

    await expect(
      enforceMagicLinkRateLimit(
        createRequest('other@rumahberbagi.test', '203.0.113.10'),
        now
      )
    ).rejects.toThrow(MAGIC_LINK_RATE_LIMIT_MESSAGE)

    expect(create).toHaveBeenCalledTimes(2)
  })

  it('uses x-real-ip when x-forwarded-for is absent', async () => {
    count.mockResolvedValue(0)

    await enforceMagicLinkRateLimit(
      createRequest('member@rumahberbagi.test', undefined, '198.51.100.20'),
      now
    )

    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        entityId: 'ip:198.51.100.20',
        ipAddress: '198.51.100.20',
      }),
    })
  })

  it('does not record invalid email requests that will not send email', async () => {
    await enforceMagicLinkRateLimit(createRequest('not-an-email'), now)

    expect(transaction).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
  })

  it('does not record burner email requests that will not send email', async () => {
    await enforceMagicLinkRateLimit(createRequest('user@example.com'), now)

    expect(transaction).not.toHaveBeenCalled()
    expect(create).not.toHaveBeenCalled()
  })

  it('excludes requests exactly at the window cutoff', async () => {
    count.mockResolvedValue(0)

    await enforceMagicLinkRateLimit(
      createRequest('member@rumahberbagi.test', '203.0.113.10'),
      now
    )

    expect(count).toHaveBeenCalledWith({
      where: expect.objectContaining({
        entityId: 'email:member@rumahberbagi.test',
        createdAt: { gt: new Date('2026-07-02T09:45:00.000Z') },
      }),
    })
  })
})

function createRequest(email: string, forwardedIp?: string, realIp?: string) {
  const form = new URLSearchParams({ email })
  const headers = new Headers({
    'content-type': 'application/x-www-form-urlencoded',
  })

  if (forwardedIp) headers.set('x-forwarded-for', `${forwardedIp}, 10.0.0.1`)
  if (realIp) headers.set('x-real-ip', realIp)

  return new Request('http://localhost:3000/login', {
    method: 'POST',
    headers,
    body: form,
  })
}
