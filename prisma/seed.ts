import { PrismaClient } from '@prisma/client'
import { chapterBuilder } from '../app/models/__mocks__/chapter'
import { courseBuilder } from '../app/models/__mocks__/course'
import { lessonBuilder } from '../app/models/__mocks__/lesson'
import { subscriptionBuilder } from '../app/models/__mocks__/subscription'
import { transactionBuilder } from '../app/models/__mocks__/transaction'
import { userBuilder } from '../app/models/__mocks__/user'
import { writeFixture } from '../app/utils/fixtures'

const prisma = new PrismaClient()

async function main() {
  // create user with admin role and store it as a local fixture
  const admin = await prisma.user.create({
    data: userBuilder({ traits: ['admin'] }),
  })
  await writeFixture(`../../e2e/fixtures/users/admin.local.json`, admin)

  // create user with author role and store it as a local fixture
  const author = await prisma.user.create({
    data: userBuilder({ traits: ['author'] }),
  })
  await writeFixture(`../../e2e/fixtures/users/author.local.json`, author)

  // create user with member role and store it as a local fixture
  const member = await prisma.user.create({
    data: userBuilder({ traits: ['member'] }),
  })
  await writeFixture(`../../e2e/fixtures/users/member.local.json`, member)

  // create another user with member role for transactions submission purpose and store it as a local fixture
  const memberSubmit = await prisma.user.create({
    data: userBuilder({ overrides: { phoneNumber: '+6512345678' } }),
  })
  await writeFixture(
    `../../e2e/fixtures/users/member-submit.local.json`,
    memberSubmit
  )

  // create another user with member role for editing purpose and store it as a local fixture
  const memberEdit = await prisma.user.create({
    data: userBuilder({ overrides: { phoneNumber: '+6512345678' } }),
  })
  await writeFixture(
    `../../e2e/fixtures/users/member-edit.local.json`,
    memberEdit
  )

  // create another user with member role without phone number
  const memberWithoutPhoneNumber = await prisma.user.create({
    data: userBuilder({ overrides: { phoneNumber: null } }),
  })

  // create user with member role and never create a transaction for it
  const memberWithoutTransaction = await prisma.user.create({
    data: userBuilder(),
  })
  await writeFixture(
    `../../e2e/fixtures/users/member-no-transaction.local.json`,
    memberWithoutTransaction
  )

  // create course
  const course = await prisma.course.create({
    data: {
      authorId: author.id,
      ...courseBuilder(),
    },
  })

  // create chapters
  const courseId = course.id
  const chapters = await Promise.all([
    prisma.chapter.create({ data: { courseId, ...chapterBuilder() } }),
    prisma.chapter.create({ data: { courseId, ...chapterBuilder() } }),
    prisma.chapter.create({ data: { courseId, ...chapterBuilder() } }),
    prisma.chapter.create({ data: { courseId, ...chapterBuilder() } }),
    prisma.chapter.create({ data: { courseId, ...chapterBuilder() } }),
  ])

  await writeFixture(
    `../../e2e/fixtures/chapters/chapters.local.json`,
    chapters
  )

  const lessons = await Promise.all(
    chapters.flatMap((chapter) => [
      prisma.lesson.create({
        data: { chapterId: chapter.id, ...lessonBuilder() },
      }),
      prisma.lesson.create({
        data: { chapterId: chapter.id, ...lessonBuilder() },
      }),
      prisma.lesson.create({
        data: { chapterId: chapter.id, ...lessonBuilder() },
      }),
      prisma.lesson.create({
        data: { chapterId: chapter.id, ...lessonBuilder() },
      }),
      prisma.lesson.create({
        data: { chapterId: chapter.id, ...lessonBuilder() },
      }),
    ])
  )

  await writeFixture(`../../e2e/fixtures/lessons/lessons.local.json`, lessons)

  // create transaction with SUBMITTED status and store it as a local fixture
  const submitted = await prisma.transaction.create({
    data: {
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
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
