import { build, fake, perBuild } from '@jackfranklin/test-data-bot'
import { Content } from '@prisma/client'
import { CONTENT_TYPES } from '../enum'

export const contentBuilder = build<
  Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'courseId'>
>({
  fields: {
    slug: fake((f) => f.lorem.slug()),
    name: fake((f) => f.lorem.sentence()),
    description: fake((f) => f.lorem.paragraphs()),
    type: perBuild(() => CONTENT_TYPES.VIDEO),
    content: 'G3ZS8x86588', // YouTube video ID
    order: fake((f) => f.datatype.number({ min: 0, max: 100 })),
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
