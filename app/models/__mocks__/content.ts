import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Content } from '@prisma/client'
import { CONTENT_TYPES } from '../enum'
import { mockParagraph, mockSentence, mockSlug, randomInt } from './mock-data'

export const contentBuilder = build<
  Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'courseId'>
>({
  fields: {
    slug: perBuild(() => mockSlug('content')),
    name: perBuild(() => mockSentence('Content')),
    description: perBuild(() => mockParagraph('Content description')),
    type: perBuild(() => CONTENT_TYPES.VIDEO),
    content: 'G3ZS8x86588', // YouTube video ID
    order: perBuild(() => randomInt(0, 100)),
  },
  traits: {
    video: {
      overrides: {
        type: perBuild(() => CONTENT_TYPES.VIDEO),
        content: 'G3ZS8x86588',
      },
    },
  },
})
