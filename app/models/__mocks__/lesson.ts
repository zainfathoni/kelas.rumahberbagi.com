import { build, fake } from '@jackfranklin/test-data-bot'
import { Lesson } from '@prisma/client'

export const lessonBuilder = build<
  Omit<Lesson, 'id' | 'createdAt' | 'updatedAt' | 'chapterId'>
>({
  fields: {
    name: fake((f) => f.lorem.sentence()),
    description: fake((f) => f.lorem.paragraphs()),
    videoId: 'G3ZS8x86588', // https://www.youtube.com/watch?v=G3ZS8x86588
    order: fake((f) => f.datatype.number()),
  },
})
