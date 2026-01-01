import { Course, User } from '@prisma/client'
import { ROLES, SUBSCRIPTION_STATUS } from '~/models/enum'
import { UserWithSubscriptions } from '~/models/user'
import { Serialized } from '~/utils/types'

type AnyUser = User | Serialized<User>
type AnyUserWithSubscriptions =
  | UserWithSubscriptions
  | Serialized<UserWithSubscriptions>
type AnyCourse = Course | Serialized<Course>

export const requireAdmin = (user: AnyUser) => {
  return user.role === ROLES.ADMIN
}

export const requireAuthor = (user: AnyUser) => {
  return requireAdmin(user) || user.role === ROLES.AUTHOR
}

export const requireCourseAuthor = (user: AnyUser, course?: AnyCourse) => {
  return (
    requireAdmin(user) ||
    (user.role === ROLES.AUTHOR && course?.authorId === user.id)
  )
}

export const requireActiveSubscription = (
  user: AnyUserWithSubscriptions,
  course?: AnyCourse
) => {
  return (
    requireCourseAuthor(user, course) ||
    user.subscriptions.some(
      (sub) =>
        sub.courseId === course?.id && sub.status === SUBSCRIPTION_STATUS.ACTIVE
    )
  )
}
