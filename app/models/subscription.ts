import { db } from '~/utils/db.server'

export async function getSubscriptionActiveByUserId(userId: string) {
  return await db.subscription.findFirst({
    where: {
      userId,
      status: 'active',
    },
  })
}
