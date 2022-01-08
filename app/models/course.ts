import { db } from '~/utils/db.server'

export async function getFirstCourse() {
  return await db.course.findFirst()
}
