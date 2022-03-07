import { build, fake } from '@jackfranklin/test-data-bot'
import { Chapter } from '@prisma/client'

export const chapterBuilder = build<
  Omit<Chapter, 'id' | 'createdAt' | 'updatedAt' | 'courseId'>
>({
  fields: {
    name: fake((f) => f.commerce.productName()),
    order: fake((f) => f.datatype.number()),
  },
})
