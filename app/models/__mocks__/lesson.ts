import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Lesson } from '@prisma/client'
import { mockParagraph, mockSentence, randomInt } from './mock-data'

export const lessonBuilder = build<
  Omit<Lesson, 'id' | 'createdAt' | 'updatedAt' | 'chapterId'>
>({
  fields: {
    name: perBuild(() => mockSentence('Lesson')),
    description: perBuild(() => mockParagraph('Lesson description')),
    videoId: 'G3ZS8x86588', // https://www.youtube.com/watch?v=G3ZS8x86588
    order: perBuild(() => randomInt(1, 20)),
  },
})
