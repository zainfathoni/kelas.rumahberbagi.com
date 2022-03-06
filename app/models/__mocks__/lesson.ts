import { build, fake } from '@jackfranklin/test-data-bot'
import { Lesson } from '@prisma/client'

export const lessonBuilder = build<
  Omit<Lesson, 'id' | 'createdAt' | 'updatedAt' | 'chapterId'>
>({
  fields: {
    name: fake((f) => f.commerce.productName()),
    description: fake((f) => f.commerce.productDescription()),
    video: fake((f) => f.image.imageUrl()),
    order: fake((f) => f.datatype.number()),
  },
})
