import { Course, User } from '@prisma/client'
import { ROLES, SUBSCRIPTION_STATUS } from '~/models/enum'
import { UserWithSubscriptions } from '~/models/user'

export const requireAdmin = (user: User) => {
  return user.role === ROLES.ADMIN
}

export const requireAuthor = (user: User) => {
  return requireAdmin(user) || user.role === ROLES.AUTHOR
}

export const requireCourseAuthor = (user: User, course?: Course) => {
  return (
    requireAdmin(user) ||
    (user.role === ROLES.AUTHOR && course?.authorId === user.id)
  )
}

export const requireActiveSubscription = (
  user: UserWithSubscriptions,
  course?: Course
) => {
  return (
    requireCourseAuthor(user, course) ||
    user.subscriptions.some(
      (sub) =>
        sub.courseId === course?.id && sub.status === SUBSCRIPTION_STATUS.ACTIVE
    )
  )
}
