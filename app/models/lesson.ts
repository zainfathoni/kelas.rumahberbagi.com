import { Lesson } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function getLessonById(id: string): Promise<Lesson | null> {
  return await db.lesson.findUnique({
    where: { id },
  })
}
