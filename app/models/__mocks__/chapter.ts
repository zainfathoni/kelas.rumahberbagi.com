import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Chapter } from '@prisma/client'

export const chapterBuilder = build<
  Omit<Chapter, 'id' | 'createdAt' | 'updatedAt' | 'courseId'>
>({
  fields: {
    name: perBuild(() => faker.commerce.productName()),
    order: perBuild(() => faker.number.int()),
  },
})
