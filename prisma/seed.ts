import { PrismaClient } from '@prisma/client'
import { courseBuilder } from '../app/models/__mocks__/course'
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
  const member = await prisma.user.create({ data: userBuilder() })
  await writeFixture(`../../e2e/fixtures/users/member.local.json`, member)

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

  // create course
  const course = await prisma.course.create({
    data: {
      authorId: author.id,
      ...courseBuilder(),
    },
  })

  // create transaction with SUBMITTED status and store it as a local fixture
  const submitted = await prisma.transaction.create({
    data: {
      userId: member.id,
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
