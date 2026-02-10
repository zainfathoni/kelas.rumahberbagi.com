import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Attachment } from '@prisma/client'

export const attachmentBuilder = build<
  Omit<Attachment, 'id' | 'createdAt' | 'updatedAt' | 'lessonId'>
>({
  fields: {
    name: perBuild(() => `${faker.lorem.sentence()}.pdf`),
    url: perBuild(
      () =>
        `https://${faker.internet.domainName()}/files/${faker.lorem.slug()}.pdf`
    ),
  },
  traits: {
    actual: {
      overrides: {
        name: 'Handout Materi Tahun Prasekolahku 2022.pdf',
        url: '/files/handout-materi-tahun-prasekolahku-2022.pdf',
      },
    },
  },
})
