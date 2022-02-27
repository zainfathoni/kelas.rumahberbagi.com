import { SUBSCRIPTION_STATUS } from './enum'
import { db } from '~/utils/db.server'

export async function getFirstActiveSubcriptionByUserId(userId: string) {
  return await db.subscription.findFirst({
    where: {
      userId,
      status: SUBSCRIPTION_STATUS.ACTIVE,
    },
  })
}
