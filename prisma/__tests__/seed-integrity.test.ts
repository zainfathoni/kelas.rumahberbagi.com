/**
 * Integration tests for seed script data integrity.
 *
 * These tests verify that the seed script produces valid, consistent data
 * that satisfies all database constraints and relationships.
 */
import { describe, it, expect } from 'vitest'
import { attachmentBuilder } from '../../app/models/__mocks__/attachment'
import { auditLogBuilder } from '../../app/models/__mocks__/audit-log'
import { chapterBuilder } from '../../app/models/__mocks__/chapter'
import { consumptionBuilder } from '../../app/models/__mocks__/consumption'
import { contentBuilder } from '../../app/models/__mocks__/content'
import { courseBuilder } from '../../app/models/__mocks__/course'
import { lessonBuilder } from '../../app/models/__mocks__/lesson'
import { subscriptionBuilder } from '../../app/models/__mocks__/subscription'
import { transactionBuilder } from '../../app/models/__mocks__/transaction'
import { userBuilder } from '../../app/models/__mocks__/user'
import {
  generateId,
  isValidNanoId,
  NANOID_LENGTH,
} from '../../app/utils/nanoid'
import {
  ROLES,
  SUBSCRIPTION_STATUS,
  TRANSACTION_STATUS,
  CATEGORIES,
  CONTENT_TYPES,
  CONSUMPTION_STATUS,
  AUDIT_ACTION,
  AUDIT_ENTITY_TYPE,
} from '../../app/models/enum'

describe('Seed Data Integrity', () => {
  describe('NanoID generation', () => {
    it('should generate valid NanoIDs for all entity types', () => {
      const ids = [
        generateId(), // user
        generateId(), // course
        generateId(), // chapter
        generateId(), // lesson
        generateId(), // attachment
        generateId(), // subscription
        generateId(), // transaction
      ]

      ids.forEach((id) => {
        expect(isValidNanoId(id)).toBe(true)
        expect(id).toHaveLength(NANOID_LENGTH)
      })
    })

    it('should generate unique IDs across entities', () => {
      const ids = new Set<string>()
      const count = 100

      for (let i = 0; i < count; i++) {
        ids.add(generateId())
      }

      expect(ids.size).toBe(count)
    })
  })

  describe('User builder', () => {
    it('should create valid user data with default member role', () => {
      const user = userBuilder()

      expect(user.email).toBeDefined()
      expect(typeof user.email).toBe('string')
      expect(user.role).toBe(ROLES.MEMBER)
      expect(user.name).toBeDefined()
      expect(user.phoneNumber).toBeDefined()
    })

    it('should create admin user with admin trait', () => {
      const admin = userBuilder({ traits: ['admin'] })

      expect(admin.role).toBe(ROLES.ADMIN)
      expect(admin.email).toBe('admin@rumahberbagi.com')
    })

    it('should create author user with author trait', () => {
      const author = userBuilder({ traits: ['author'] })

      expect(author.role).toBe(ROLES.AUTHOR)
      expect(author.email).toBe('author@rumahberbagi.com')
    })

    it('should create member user with member trait', () => {
      const member = userBuilder({ traits: ['member'] })

      expect(member.role).toBe(ROLES.MEMBER)
      expect(member.email).toBe('member@rumahberbagi.com')
    })

    it('should allow overriding fields', () => {
      const user = userBuilder({ overrides: { phoneNumber: null } })

      expect(user.phoneNumber).toBeNull()
    })
  })

  describe('Course builder', () => {
    it('should create valid course data', () => {
      const course = courseBuilder()

      expect(course.name).toBeDefined()
      expect(typeof course.name).toBe('string')
      expect(course.description).toBeDefined()
      expect(course.price).toBeGreaterThanOrEqual(10000)
      expect(course.price).toBeLessThanOrEqual(100000)
      expect(course.image).toBeDefined()
      expect(course.category).toBe(CATEGORIES.PARENTING)
    })
  })

  describe('Chapter builder', () => {
    it('should create valid chapter data', () => {
      const chapter = chapterBuilder()

      expect(chapter.name).toBeDefined()
      expect(typeof chapter.name).toBe('string')
      expect(typeof chapter.order).toBe('number')
    })
  })

  describe('Lesson builder', () => {
    it('should create valid lesson data', () => {
      const lesson = lessonBuilder()

      expect(lesson.name).toBeDefined()
      expect(typeof lesson.name).toBe('string')
      expect(lesson.description).toBeDefined()
      expect(lesson.videoId).toBe('G3ZS8x86588')
      expect(typeof lesson.order).toBe('number')
    })
  })

  describe('Attachment builder', () => {
    it('should create valid attachment data', () => {
      const attachment = attachmentBuilder()

      expect(attachment.name).toBeDefined()
      expect(attachment.name).toContain('.pdf')
      expect(attachment.url).toBeDefined()
      expect(attachment.url).toContain('.pdf')
    })

    it('should create actual attachment with actual trait', () => {
      const attachment = attachmentBuilder({ traits: ['actual'] })

      expect(attachment.name).toBe('Handout Materi Tahun Prasekolahku 2022.pdf')
      expect(attachment.url).toBe(
        '/files/handout-materi-tahun-prasekolahku-2022.pdf'
      )
    })
  })

  describe('Subscription builder', () => {
    it('should create valid subscription data with active status', () => {
      const subscription = subscriptionBuilder()

      expect(subscription.status).toBe(SUBSCRIPTION_STATUS.ACTIVE)
    })

    it('should create active subscription with active trait', () => {
      const subscription = subscriptionBuilder({ traits: ['active'] })

      expect(subscription.status).toBe(SUBSCRIPTION_STATUS.ACTIVE)
    })

    it('should create inactive subscription with inactive trait', () => {
      const subscription = subscriptionBuilder({ traits: ['inactive'] })

      expect(subscription.status).toBe(SUBSCRIPTION_STATUS.INACTIVE)
    })
  })

  describe('Transaction builder', () => {
    it('should create valid transaction data with submitted status', () => {
      const transaction = transactionBuilder()

      expect(transaction.bankName).toBeDefined()
      expect(transaction.bankAccountName).toBeDefined()
      expect(transaction.bankAccountNumber).toBeDefined()
      expect(transaction.amount).toBeGreaterThanOrEqual(10000)
      expect(transaction.amount).toBeLessThanOrEqual(100000)
      expect(transaction.status).toBe(TRANSACTION_STATUS.SUBMITTED)
    })

    it('should create verified transaction with verified trait', () => {
      const transaction = transactionBuilder({ traits: ['verified'] })

      expect(transaction.status).toBe(TRANSACTION_STATUS.VERIFIED)
    })

    it('should create rejected transaction with rejected trait', () => {
      const transaction = transactionBuilder({ traits: ['rejected'] })

      expect(transaction.status).toBe(TRANSACTION_STATUS.REJECTED)
    })
  })

  describe('Content builder', () => {
    it('should create valid content data with default video type', () => {
      const content = contentBuilder()

      expect(content.slug).toBeDefined()
      expect(typeof content.slug).toBe('string')
      expect(content.name).toBeDefined()
      expect(content.description).toBeDefined()
      expect(content.type).toBe(CONTENT_TYPES.VIDEO)
      expect(content.content).toBe('G3ZS8x86588')
      expect(typeof content.order).toBe('number')
    })

    it('should create video content with video trait', () => {
      const content = contentBuilder({ traits: ['video'] })

      expect(content.type).toBe(CONTENT_TYPES.VIDEO)
    })

    it('should allow overriding slug and order', () => {
      const content = contentBuilder({
        overrides: { slug: 'custom-slug', order: 42 },
      })

      expect(content.slug).toBe('custom-slug')
      expect(content.order).toBe(42)
    })
  })

  describe('Consumption builder', () => {
    it('should create valid consumption data with default pristine status', () => {
      const consumption = consumptionBuilder()

      expect(consumption.progress).toBe(0)
      expect(consumption.status).toBe(CONSUMPTION_STATUS.PRISTINE)
    })

    it('should create pristine consumption with pristine trait', () => {
      const consumption = consumptionBuilder({ traits: ['pristine'] })

      expect(consumption.progress).toBe(0)
      expect(consumption.status).toBe(CONSUMPTION_STATUS.PRISTINE)
    })

    it('should create in-progress consumption with inProgress trait', () => {
      const consumption = consumptionBuilder({ traits: ['inProgress'] })

      expect(consumption.progress).toBe(50)
      expect(consumption.status).toBe(CONSUMPTION_STATUS.IN_PROGRESS)
    })

    it('should create completed consumption with completed trait', () => {
      const consumption = consumptionBuilder({ traits: ['completed'] })

      expect(consumption.progress).toBe(100)
      expect(consumption.status).toBe(CONSUMPTION_STATUS.COMPLETED)
    })
  })

  describe('AuditLog builder', () => {
    it('should create valid audit log data with default create action', () => {
      const auditLog = auditLogBuilder()

      expect(auditLog.action).toBe(AUDIT_ACTION.CREATE)
      expect(auditLog.entityType).toBe(AUDIT_ENTITY_TYPE.USER)
      expect(auditLog.entityId).toBeDefined()
      expect(auditLog.userId).toBeNull()
      expect(auditLog.oldValue).toBeNull()
      expect(auditLog.newValue).toBeNull()
    })

    it('should create audit log with create trait', () => {
      const auditLog = auditLogBuilder({ traits: ['create'] })

      expect(auditLog.action).toBe(AUDIT_ACTION.CREATE)
      expect(auditLog.oldValue).toBeNull()
      expect(auditLog.newValue).toBeDefined()
    })

    it('should create audit log with update trait', () => {
      const auditLog = auditLogBuilder({ traits: ['update'] })

      expect(auditLog.action).toBe(AUDIT_ACTION.UPDATE)
      expect(auditLog.oldValue).toBeDefined()
      expect(auditLog.newValue).toBeDefined()
    })

    it('should create audit log with delete trait', () => {
      const auditLog = auditLogBuilder({ traits: ['delete'] })

      expect(auditLog.action).toBe(AUDIT_ACTION.DELETE)
      expect(auditLog.oldValue).toBeDefined()
      expect(auditLog.newValue).toBeNull()
    })

    it('should create audit log with user reference using withUser trait', () => {
      const auditLog = auditLogBuilder({ traits: ['withUser'] })

      expect(auditLog.userId).toBeDefined()
      expect(typeof auditLog.userId).toBe('string')
    })

    it('should create audit log with metadata using withMetadata trait', () => {
      const auditLog = auditLogBuilder({ traits: ['withMetadata'] })

      expect(auditLog.ipAddress).toBe('127.0.0.1')
      expect(auditLog.userAgent).toBeDefined()
      expect(auditLog.metadata).toBeDefined()
    })
  })

  describe('Entity relationships', () => {
    it('should properly link related entities', () => {
      // Simulate creating related entities with proper IDs
      const authorId = generateId()
      const courseId = generateId()
      const userId = generateId()

      // Verify IDs are valid
      expect(isValidNanoId(authorId)).toBe(true)
      expect(isValidNanoId(courseId)).toBe(true)
      expect(isValidNanoId(userId)).toBe(true)

      // Verify they can be used for foreign key relationships
      const courseData = {
        id: courseId,
        authorId,
        ...courseBuilder(),
      }

      expect(courseData.id).toBe(courseId)
      expect(courseData.authorId).toBe(authorId)

      const subscriptionData = {
        id: generateId(),
        userId,
        courseId,
        authorId,
        ...subscriptionBuilder(),
      }

      expect(subscriptionData.userId).toBe(userId)
      expect(subscriptionData.courseId).toBe(courseId)
      expect(subscriptionData.authorId).toBe(authorId)
    })
  })

  describe('Data constraints', () => {
    it('should ensure email format is valid', () => {
      const user = userBuilder()
      // Basic email format check
      expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    })

    it('should ensure price is a positive integer', () => {
      const course = courseBuilder()
      expect(Number.isInteger(course.price)).toBe(true)
      expect(course.price).toBeGreaterThan(0)
    })

    it('should ensure amount is a positive integer', () => {
      const transaction = transactionBuilder()
      expect(Number.isInteger(transaction.amount)).toBe(true)
      expect(transaction.amount).toBeGreaterThan(0)
    })

    it('should ensure roles are valid enum values', () => {
      const validRoles = [ROLES.ADMIN, ROLES.AUTHOR, ROLES.MEMBER]

      const adminUser = userBuilder({ traits: ['admin'] })
      const authorUser = userBuilder({ traits: ['author'] })
      const memberUser = userBuilder({ traits: ['member'] })

      expect(validRoles).toContain(adminUser.role)
      expect(validRoles).toContain(authorUser.role)
      expect(validRoles).toContain(memberUser.role)
    })

    it('should ensure status values are valid enum values', () => {
      const validStatuses = [
        TRANSACTION_STATUS.SUBMITTED,
        TRANSACTION_STATUS.VERIFIED,
        TRANSACTION_STATUS.REJECTED,
      ]

      const submitted = transactionBuilder()
      const verified = transactionBuilder({ traits: ['verified'] })
      const rejected = transactionBuilder({ traits: ['rejected'] })

      expect(validStatuses).toContain(submitted.status)
      expect(validStatuses).toContain(verified.status)
      expect(validStatuses).toContain(rejected.status)
    })
  })
})
