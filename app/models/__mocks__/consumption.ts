import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Consumption } from '@prisma/client'
import { CONSUMPTION_STATUS } from '../enum'

export const consumptionBuilder = build<
  Omit<
    Consumption,
    'id' | 'createdAt' | 'updatedAt' | 'userId' | 'contentId' | 'courseId'
  >
>({
  fields: {
    progress: perBuild(() => 0),
    status: perBuild(() => CONSUMPTION_STATUS.PRISTINE),
  },
  traits: {
    pristine: {
      overrides: {
        progress: perBuild(() => 0),
        status: perBuild(() => CONSUMPTION_STATUS.PRISTINE),
      },
    },
    inProgress: {
      overrides: {
        progress: perBuild(() => 50),
        status: perBuild(() => CONSUMPTION_STATUS.IN_PROGRESS),
      },
    },
    completed: {
      overrides: {
        progress: perBuild(() => 100),
        status: perBuild(() => CONSUMPTION_STATUS.COMPLETED),
      },
    },
  },
})
