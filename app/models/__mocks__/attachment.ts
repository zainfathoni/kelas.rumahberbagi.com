import { build, fake } from '@jackfranklin/test-data-bot'
import { Attachment } from '@prisma/client'

export const attachmentBuilder = build<
  Omit<Attachment, 'id' | 'createdAt' | 'updatedAt' | 'lessonId'>
>({
  fields: {
    name: fake((f) => `${f.lorem.sentence()}.pdf`),
    url: fake(
      (f) => `https://${f.internet.domainName()}/files/${f.lorem.slug()}.pdf`
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
