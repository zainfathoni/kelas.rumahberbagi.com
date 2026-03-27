import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Chapter } from '@prisma/client'
import { mockSentence, randomInt } from './mock-data'

export const chapterBuilder = build<
  Omit<Chapter, 'id' | 'createdAt' | 'updatedAt' | 'courseId'>
>({
  fields: {
    name: perBuild(() => mockSentence('Chapter')),
    order: perBuild(() => randomInt(1, 20)),
  },
})
