import { Attachment, Lesson } from '@prisma/client'
import { db } from '~/utils/db.server'

export type LessonWithAttachments = Lesson & { attachments: Attachment[] }

export async function getLessonById(
  id: string
): Promise<LessonWithAttachments | null> {
  return await db.lesson.findUnique({
    where: { id },
    include: { attachments: true },
  })
}

export async function updateLessonDescription(
  id: string,
  description: string
): Promise<Lesson | null> {
  return await db.lesson.update({
    where: { id },
    data: { description },
  })
}
