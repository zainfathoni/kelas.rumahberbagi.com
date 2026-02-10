import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Lesson } from '@prisma/client'

export const lessonBuilder = build<
  Omit<Lesson, 'id' | 'createdAt' | 'updatedAt' | 'chapterId'>
>({
  fields: {
    name: perBuild(() => faker.lorem.sentence()),
    description: perBuild(() => faker.lorem.paragraphs()),
    videoId: 'G3ZS8x86588', // https://www.youtube.com/watch?v=G3ZS8x86588
    order: perBuild(() => faker.number.int()),
  },
})
