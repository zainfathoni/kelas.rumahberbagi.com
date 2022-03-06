import { Chapter, Lesson } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function getFirstCourse() {
  // TODO: refactor this code once the assumption that there is only one course is no longer valid
  const course = await db.course.findFirst()
  if (!course) {
    throw new Error('No course found')
  }
  return course
}

export type Chapters = (Chapter & {
  lessons: Lesson[]
})[]

export async function getAllChapters(courseId: string): Promise<Chapters> {
  const chapters = await db.course
    .findUnique({
      where: { id: courseId },
    })
    .chapters({ include: { lessons: true } })
  return chapters
}
