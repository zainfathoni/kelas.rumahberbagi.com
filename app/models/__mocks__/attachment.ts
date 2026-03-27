import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Attachment } from '@prisma/client'
import { mockFileUrl, mockSentence } from './mock-data'

export const attachmentBuilder = build<
  Omit<Attachment, 'id' | 'createdAt' | 'updatedAt' | 'lessonId'>
>({
  fields: {
    name: perBuild(() => `${mockSentence('Attachment')}.pdf`),
    url: perBuild(() => mockFileUrl('pdf')),
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
