import { Course, User } from '@prisma/client'
import { ROLES } from '~/models/enum'

export const requireAdmin = (user: User) => {
  return user.role === ROLES.ADMIN
}

export const requireAuthor = (user: User) => {
  return requireAdmin(user) || user.role === ROLES.AUTHOR
}

export const requireCourseAuthor = (user: User, course: Course) => {
  return (
    requireAdmin(user) ||
    (user.role === ROLES.AUTHOR && course.authorId === user.id)
  )
}
