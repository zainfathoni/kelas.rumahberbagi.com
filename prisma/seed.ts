import { PrismaClient } from '@prisma/client'
import { attachmentBuilder } from '../app/models/__mocks__/attachment'
import { auditLogBuilder } from '../app/models/__mocks__/audit-log'
import { chapterBuilder } from '../app/models/__mocks__/chapter'
import { consumptionBuilder } from '../app/models/__mocks__/consumption'
import { contentBuilder } from '../app/models/__mocks__/content'
import { courseBuilder } from '../app/models/__mocks__/course'
import { lessonBuilder } from '../app/models/__mocks__/lesson'
import { subscriptionBuilder } from '../app/models/__mocks__/subscription'
import { transactionBuilder } from '../app/models/__mocks__/transaction'
import { userBuilder } from '../app/models/__mocks__/user'
import { writeFixture } from '../app/utils/fixtures'
import { generateId } from '../app/utils/nanoid'
import { AUDIT_ENTITY_TYPE } from '../app/models/enum'

const prisma = new PrismaClient()

async function main() {
  // create user with admin role and store it as a local fixture
  const admin = await prisma.user.create({
    data: { id: generateId(), ...userBuilder({ traits: ['admin'] }) },
  })
  await writeFixture(`../../e2e/fixtures/users/admin.local.json`, admin)

  // create user with author role and store it as a local fixture
  const author = await prisma.user.create({
    data: { id: generateId(), ...userBuilder({ traits: ['author'] }) },
  })
  await writeFixture(`../../e2e/fixtures/users/author.local.json`, author)

  // create user with member role and store it as a local fixture
  const member = await prisma.user.create({
    data: { id: generateId(), ...userBuilder({ traits: ['member'] }) },
  })
  await writeFixture(`../../e2e/fixtures/users/member.local.json`, member)

  // create another user with member role for transactions submission purpose and store it as a local fixture
  const memberSubmit = await prisma.user.create({
    data: {
      id: generateId(),
      ...userBuilder({ overrides: { phoneNumber: '+6512345678' } }),
    },
  })
  await writeFixture(
    `../../e2e/fixtures/users/member-submit.local.json`,
    memberSubmit
  )

  // create another user with member role for editing purpose and store it as a local fixture
  const memberEdit = await prisma.user.create({
    data: {
      id: generateId(),
      ...userBuilder({ overrides: { phoneNumber: '+6512345678' } }),
    },
  })
  await writeFixture(
    `../../e2e/fixtures/users/member-edit.local.json`,
    memberEdit
  )

  // create another user with member role without phone number
  const memberWithoutPhoneNumber = await prisma.user.create({
    data: {
      id: generateId(),
      ...userBuilder({ overrides: { phoneNumber: null } }),
    },
  })

  // create user with member role and never create a transaction for it
  const memberWithoutTransaction = await prisma.user.create({
    data: { id: generateId(), ...userBuilder() },
  })
  await writeFixture(
    `../../e2e/fixtures/users/member-no-transaction.local.json`,
    memberWithoutTransaction
  )

  // create course
  const course = await prisma.course.create({
    data: {
      id: generateId(),
      authorId: author.id,
      ...courseBuilder(),
    },
  })

  // create chapters
  const courseId = course.id
  const chapters = await Promise.all([
    prisma.chapter.create({
      data: { id: generateId(), courseId, ...chapterBuilder() },
    }),
    prisma.chapter.create({
      data: { id: generateId(), courseId, ...chapterBuilder() },
    }),
    prisma.chapter.create({
      data: { id: generateId(), courseId, ...chapterBuilder() },
    }),
    prisma.chapter.create({
      data: { id: generateId(), courseId, ...chapterBuilder() },
    }),
    prisma.chapter.create({
      data: { id: generateId(), courseId, ...chapterBuilder() },
    }),
  ])
  await writeFixture(
    `../../e2e/fixtures/chapters/chapters.local.json`,
    chapters
  )

  const lessons = await Promise.all(
    chapters.flatMap((chapter) => [
      prisma.lesson.create({
        data: { id: generateId(), chapterId: chapter.id, ...lessonBuilder() },
      }),
      prisma.lesson.create({
        data: { id: generateId(), chapterId: chapter.id, ...lessonBuilder() },
      }),
      prisma.lesson.create({
        data: { id: generateId(), chapterId: chapter.id, ...lessonBuilder() },
      }),
      prisma.lesson.create({
        data: { id: generateId(), chapterId: chapter.id, ...lessonBuilder() },
      }),
      prisma.lesson.create({
        data: { id: generateId(), chapterId: chapter.id, ...lessonBuilder() },
      }),
    ])
  )
  await writeFixture(`../../e2e/fixtures/lessons/lessons.local.json`, lessons)

  const attachments = await Promise.all(
    lessons.flatMap((lesson) => [
      prisma.attachment.create({
        data: { id: generateId(), lessonId: lesson.id, ...attachmentBuilder() },
      }),
      prisma.attachment.create({
        data: {
          id: generateId(),
          lessonId: lesson.id,
          ...attachmentBuilder({ traits: ['actual'] }),
        },
      }),
    ])
  )
  await writeFixture(
    `../../e2e/fixtures/lessons/attachments.local.json`,
    attachments
  )

  // create content items for the new Content entity
  const contents = await Promise.all([
    prisma.content.create({
      data: {
        id: generateId(),
        authorId: author.id,
        courseId: course.id,
        ...contentBuilder({ overrides: { slug: 'intro', order: 1 } }),
      },
    }),
    prisma.content.create({
      data: {
        id: generateId(),
        authorId: author.id,
        courseId: course.id,
        ...contentBuilder({ overrides: { slug: 'lesson-1', order: 2 } }),
      },
    }),
    prisma.content.create({
      data: {
        id: generateId(),
        authorId: author.id,
        courseId: course.id,
        ...contentBuilder({ overrides: { slug: 'lesson-2', order: 3 } }),
      },
    }),
  ])
  await writeFixture(
    `../../e2e/fixtures/contents/contents.local.json`,
    contents
  )

  // create consumption records for member tracking content progress
  const consumptions = await Promise.all([
    prisma.consumption.create({
      data: {
        id: generateId(),
        userId: member.id,
        contentId: contents[0].id,
        courseId: course.id,
        ...consumptionBuilder({ traits: ['completed'] }),
      },
    }),
    prisma.consumption.create({
      data: {
        id: generateId(),
        userId: member.id,
        contentId: contents[1].id,
        courseId: course.id,
        ...consumptionBuilder({ traits: ['inProgress'] }),
      },
    }),
  ])
  await writeFixture(
    `../../e2e/fixtures/consumptions/consumptions.local.json`,
    consumptions
  )

  // create transaction with SUBMITTED status and store it as a local fixture
  const submitted = await prisma.transaction.create({
    data: {
      id: generateId(),
      userId: memberSubmit.id,
      courseId: course.id,
      authorId: course.authorId,
      ...transactionBuilder(),
    },
  })
  await writeFixture(
    `../../e2e/fixtures/transactions/submitted.local.json`,
    submitted
  )

  // create transaction with VERIFIED status and store it as a local fixture
  const verified = await prisma.transaction.create({
    data: {
      id: generateId(),
      userId: member.id,
      courseId: course.id,
      authorId: course.authorId,
      ...transactionBuilder({ traits: ['verified'] }),
    },
  })
  await writeFixture(
    `../../e2e/fixtures/transactions/verified.local.json`,
    verified
  )

  // create subscription with ACTIVE status and store it as a local fixture
  const active = await prisma.subscription.create({
    data: {
      id: generateId(),
      userId: member.id,
      courseId: course.id,
      authorId: course.authorId,
      ...subscriptionBuilder({ traits: ['active'] }),
    },
  })
  await writeFixture(
    `../../e2e/fixtures/subscriptions/active.local.json`,
    active
  )

  // create transaction with REJECTED status and store it as a local fixture
  const rejected = await prisma.transaction.create({
    data: {
      id: generateId(),
      userId: memberWithoutPhoneNumber.id,
      courseId: course.id,
      authorId: course.authorId,
      ...transactionBuilder({ traits: ['rejected'] }),
    },
  })
  await writeFixture(
    `../../e2e/fixtures/transactions/rejected.local.json`,
    rejected
  )

  // create sample audit log entries for demonstration
  const auditLogs = await Promise.all([
    // Audit log for user creation
    prisma.auditLog.create({
      data: {
        id: generateId(),
        ...auditLogBuilder({
          traits: ['create', 'withMetadata'],
          overrides: {
            userId: admin.id,
            entityType: AUDIT_ENTITY_TYPE.USER,
            entityId: member.id,
            newValue: JSON.stringify({
              email: member.email,
              role: member.role,
            }),
          },
        }),
      },
    }),
    // Audit log for transaction verification
    prisma.auditLog.create({
      data: {
        id: generateId(),
        ...auditLogBuilder({
          traits: ['update', 'withMetadata'],
          overrides: {
            userId: author.id,
            entityType: AUDIT_ENTITY_TYPE.TRANSACTION,
            entityId: verified.id,
            oldValue: JSON.stringify({ status: 'SUBMITTED' }),
            newValue: JSON.stringify({ status: 'VERIFIED' }),
          },
        }),
      },
    }),
    // Audit log for subscription activation
    prisma.auditLog.create({
      data: {
        id: generateId(),
        ...auditLogBuilder({
          traits: ['create', 'withMetadata'],
          overrides: {
            userId: author.id,
            entityType: AUDIT_ENTITY_TYPE.SUBSCRIPTION,
            entityId: active.id,
            newValue: JSON.stringify({
              userId: member.id,
              courseId: course.id,
              status: 'ACTIVE',
            }),
          },
        }),
      },
    }),
  ])
  await writeFixture(
    `../../e2e/fixtures/audit-logs/audit-logs.local.json`,
    auditLogs
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
