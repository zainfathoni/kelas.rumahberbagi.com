import { db } from '~/utils/db.server'
import { generateId } from '~/utils/nanoid'
import { verifyEmailAddress } from '~/services/verifier.server'

const RATE_LIMIT_ACTION = 'MAGIC_LINK_EMAIL_REQUESTED'
const RATE_LIMIT_ENTITY_TYPE = 'MagicLinkRateLimit'

const EMAIL_SHORT_WINDOW_LIMIT = 3
const EMAIL_SHORT_WINDOW_MS = 15 * 60 * 1000
const EMAIL_DAILY_LIMIT = 10
const EMAIL_DAILY_WINDOW_MS = 24 * 60 * 60 * 1000
const IP_SHORT_WINDOW_LIMIT = 20
const IP_SHORT_WINDOW_MS = 15 * 60 * 1000

export const MAGIC_LINK_RATE_LIMIT_MESSAGE =
  'Terlalu banyak permintaan link login. Silakan coba lagi nanti.'

type RateLimitScope = {
  entityId: string
  limit: number
  windowMs: number
}

class RateLimitExceeded extends Error {}

export async function enforceMagicLinkRateLimit(
  request: Request,
  now = new Date()
) {
  const form = await request.formData()
  const email = form.get('email')

  if (typeof email !== 'string') return

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) return

  try {
    await verifyEmailAddress(email)
  } catch {
    return
  }

  const scopes: RateLimitScope[] = [
    {
      entityId: `email:${normalizedEmail}`,
      limit: EMAIL_SHORT_WINDOW_LIMIT,
      windowMs: EMAIL_SHORT_WINDOW_MS,
    },
    {
      entityId: `email:${normalizedEmail}`,
      limit: EMAIL_DAILY_LIMIT,
      windowMs: EMAIL_DAILY_WINDOW_MS,
    },
  ]

  const clientIp = getClientIp(request)
  if (clientIp) {
    scopes.push({
      entityId: `ip:${clientIp}`,
      limit: IP_SHORT_WINDOW_LIMIT,
      windowMs: IP_SHORT_WINDOW_MS,
    })
  }

  try {
    await db.$transaction(async (tx) => {
      const entityIds = Array.from(
        new Set(scopes.map((scope) => scope.entityId))
      )

      await Promise.all(
        entityIds.map((entityId) =>
          tx.auditLog.create({
            data: {
              id: generateId(),
              action: RATE_LIMIT_ACTION,
              entityType: RATE_LIMIT_ENTITY_TYPE,
              entityId,
              createdAt: now,
              metadata: JSON.stringify({ email: normalizedEmail }),
              ipAddress: clientIp,
            },
          })
        )
      )

      for (const scope of scopes) {
        const count = await tx.auditLog.count({
          where: {
            action: RATE_LIMIT_ACTION,
            entityType: RATE_LIMIT_ENTITY_TYPE,
            entityId: scope.entityId,
            createdAt: { gt: new Date(now.getTime() - scope.windowMs) },
          },
        })

        if (count > scope.limit) throw new RateLimitExceeded()
      }
    })
  } catch (error) {
    if (error instanceof RateLimitExceeded) {
      throw new Error(MAGIC_LINK_RATE_LIMIT_MESSAGE)
    }

    throw error
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  const firstForwardedIp = forwardedFor?.split(',')[0]?.trim()
  if (firstForwardedIp) return firstForwardedIp

  return request.headers.get('x-real-ip')?.trim() || undefined
}
