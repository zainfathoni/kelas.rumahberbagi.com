import { Subscription } from '@prisma/client'
import { SUBSCRIPTION_STATUS } from './enum'
import { getFirstCourse } from './course'
import { db } from '~/utils/db.server'
import { generateId } from '~/utils/nanoid'

type SubscriptionStatus = 'ACTIVE' | 'INACTIVE'

async function updateSubscription(
  userId: string,
  status: SubscriptionStatus
): Promise<Subscription> {
  const course = await getFirstCourse()

  let subscription = await db.subscription.findFirst({
    where: {
      userId,
    },
  })

  if (subscription) {
    subscription = await db.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        status,
      },
    })
  } else {
    subscription = await db.subscription.create({
      data: {
        id: generateId(),
        userId,
        courseId: course.id,
        authorId: course.authorId,
        status,
      },
    })
  }

  return subscription
}

export async function activateSubscription(
  userId: string
): Promise<Subscription> {
  return await updateSubscription(
    userId,
    SUBSCRIPTION_STATUS.ACTIVE as SubscriptionStatus
  )
}

export async function deactivateSubscription(
  userId: string
): Promise<Subscription> {
  return await updateSubscription(
    userId,
    SUBSCRIPTION_STATUS.INACTIVE as SubscriptionStatus
  )
}

export async function getFirstActiveSubcriptionByUserId(userId: string) {
  return await db.subscription.findFirst({
    where: {
      userId,
      status: SUBSCRIPTION_STATUS.ACTIVE,
    },
  })
}
