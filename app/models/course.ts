import { db } from '~/utils/db.server'

export async function getFirstCourse() {
  // TODO: refactor this code once the assumption that there is only one course is no longer valid
  const course = await db.course.findFirst()
  if (!course) {
    throw new Error('No course found')
  }
  return course
}
