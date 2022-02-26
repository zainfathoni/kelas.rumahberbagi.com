import { db } from '~/utils/db.server'

export async function getFirstCourse() {
  // TODO: refactor this code once the assumption that there is only one course is no longer valid
  return await db.course.findFirst()
}
