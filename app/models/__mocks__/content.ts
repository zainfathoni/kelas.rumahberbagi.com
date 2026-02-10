import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Content } from '@prisma/client'
import { CONTENT_TYPES } from '../enum'

export const contentBuilder = build<
  Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'courseId'>
>({
  fields: {
    slug: perBuild(() => faker.lorem.slug()),
    name: perBuild(() => faker.lorem.sentence()),
    description: perBuild(() => faker.lorem.paragraphs()),
    type: perBuild(() => CONTENT_TYPES.VIDEO),
    content: 'G3ZS8x86588', // YouTube video ID
    order: perBuild(() => faker.number.int({ min: 0, max: 100 })),
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
