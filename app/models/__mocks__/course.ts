import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Course } from '@prisma/client'
import { CATEGORIES } from '../enum'
import {
  mockImageUrl,
  mockParagraph,
  mockSentence,
  randomInt,
} from './mock-data'

export const courseBuilder = build<
  Omit<Course, 'id' | 'userId' | 'authorId' | 'createdAt' | 'updatedAt'>
>({
  fields: {
    name: perBuild(() => mockSentence('Course')),
    description: perBuild(() => mockParagraph('Course description')),
    price: perBuild(() => randomInt(10_000, 100_000)),
    image: perBuild(mockImageUrl),
    category: perBuild(() => CATEGORIES.PARENTING),
  },
})
