import { User, Course, Subscription } from '@prisma/client'
import { describe, it, expect } from 'vitest'
import {
  requireAdmin,
  requireAuthor,
  requireCourseAuthor,
  requireActiveSubscription,
} from '../permissions'
import { ROLES, SUBSCRIPTION_STATUS } from '~/models/enum'
import { UserWithSubscriptions } from '~/models/user'

const createMockUser = (overrides: Partial<User>): User =>
  ({
    id: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test User',
    email: 'test@example.com',
    phoneNumber: null,
    telegram: null,
    instagram: null,
    role: ROLES.MEMBER,
    ...overrides,
  } as User)

const createMockSubscription = (
  overrides: Partial<Subscription>
): Subscription =>
  ({
    id: 'sub-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: 'author-1',
    courseId: 'course-1',
    userId: 'user-1',
    status: SUBSCRIPTION_STATUS.ACTIVE,
    ...overrides,
  } as Subscription)

const createMockUserWithSubscriptions = (
  userOverrides: Partial<User>,
  subscriptions: Partial<Subscription>[] = []
): UserWithSubscriptions => {
  return {
    ...createMockUser(userOverrides),
    subscriptions: subscriptions.map((sub) => createMockSubscription(sub)),
  } as UserWithSubscriptions
}

const createMockCourse = (overrides: Partial<Course>): Course =>
  ({
    id: 'course-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    name: 'Test Course',
    description: null,
    price: 100000,
    authorId: '2',
    ...overrides,
  } as Course)

describe('Permission functions', () => {
  const adminUser = createMockUser({ id: '1', role: ROLES.ADMIN })
  const authorUser = createMockUser({ id: '2', role: ROLES.AUTHOR })
  const memberUser = createMockUser({ id: '3', role: ROLES.MEMBER })

  const course = createMockCourse({ id: 'course-1', authorId: '2' })
  const otherCourse = createMockCourse({ id: 'course-2', authorId: '99' })

  describe('requireAdmin', () => {
    it('returns true for admin user', () => {
      expect(requireAdmin(adminUser)).toBe(true)
    })

    it('returns false for author user', () => {
      expect(requireAdmin(authorUser)).toBe(false)
    })

    it('returns false for member user', () => {
      expect(requireAdmin(memberUser)).toBe(false)
    })
  })

  describe('requireAuthor', () => {
    it('returns true for admin user', () => {
      expect(requireAuthor(adminUser)).toBe(true)
    })

    it('returns true for author user', () => {
      expect(requireAuthor(authorUser)).toBe(true)
    })

    it('returns false for member user', () => {
      expect(requireAuthor(memberUser)).toBe(false)
    })
  })

  describe('requireCourseAuthor', () => {
    it('returns true for admin regardless of course', () => {
      expect(requireCourseAuthor(adminUser, course)).toBe(true)
      expect(requireCourseAuthor(adminUser, otherCourse)).toBe(true)
      expect(requireCourseAuthor(adminUser)).toBe(true)
    })

    it('returns true for author of the course', () => {
      expect(requireCourseAuthor(authorUser, course)).toBe(true)
    })

    it('returns false for author of a different course', () => {
      expect(requireCourseAuthor(authorUser, otherCourse)).toBe(false)
    })

    it('returns false for member user', () => {
      expect(requireCourseAuthor(memberUser, course)).toBe(false)
    })
  })

  describe('requireActiveSubscription', () => {
    const memberWithActiveSubscription = createMockUserWithSubscriptions(
      { id: '3', role: ROLES.MEMBER },
      [{ courseId: 'course-1', status: SUBSCRIPTION_STATUS.ACTIVE }]
    )

    const memberWithInactiveSubscription = createMockUserWithSubscriptions(
      { id: '3', role: ROLES.MEMBER },
      [{ courseId: 'course-1', status: SUBSCRIPTION_STATUS.INACTIVE }]
    )

    const memberWithNoSubscription = createMockUserWithSubscriptions(
      { id: '3', role: ROLES.MEMBER },
      []
    )

    const authorWithSubscriptions = createMockUserWithSubscriptions(
      { id: '2', role: ROLES.AUTHOR },
      []
    )

    const adminWithSubscriptions = createMockUserWithSubscriptions(
      { id: '1', role: ROLES.ADMIN },
      []
    )

    it('returns true for admin regardless of subscription', () => {
      expect(requireActiveSubscription(adminWithSubscriptions, course)).toBe(
        true
      )
    })

    it('returns true for course author regardless of subscription', () => {
      expect(requireActiveSubscription(authorWithSubscriptions, course)).toBe(
        true
      )
    })

    it('returns true for member with active subscription to the course', () => {
      expect(
        requireActiveSubscription(memberWithActiveSubscription, course)
      ).toBe(true)
    })

    it('returns false for member with inactive subscription', () => {
      expect(
        requireActiveSubscription(memberWithInactiveSubscription, course)
      ).toBe(false)
    })

    it('returns false for member with no subscription', () => {
      expect(requireActiveSubscription(memberWithNoSubscription, course)).toBe(
        false
      )
    })

    it('returns false for member with subscription to different course', () => {
      expect(
        requireActiveSubscription(memberWithActiveSubscription, otherCourse)
      ).toBe(false)
    })
  })
})
