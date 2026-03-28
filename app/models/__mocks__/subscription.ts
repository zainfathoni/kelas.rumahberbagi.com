import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Subscription } from '@prisma/client'
import { SUBSCRIPTION_STATUS } from '../enum'

export const subscriptionBuilder = build<
  Omit<
    Subscription,
    'id' | 'userId' | 'courseId' | 'authorId' | 'createdAt' | 'updatedAt'
  >
>({
  fields: {
    status: perBuild(() => SUBSCRIPTION_STATUS.ACTIVE),
  },
  traits: {
    active: {
      overrides: { status: perBuild(() => SUBSCRIPTION_STATUS.ACTIVE) },
    },
    inactive: {
      overrides: { status: perBuild(() => SUBSCRIPTION_STATUS.INACTIVE) },
    },
  },
})
