import { PrismaClient } from '@prisma/client'
import { TRANSACTION_STATUS } from '../app/models/enum'
import { courseBuilder } from '../app/models/__mocks__/course'
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

  // create another user with member role
  const anotherMember = await prisma.user.create({ data: userBuilder() })

  // create courses
  const courses = await Promise.all(
    [courseBuilder(), courseBuilder(), courseBuilder()].map((course) =>
      prisma.course.create({
        data: {
          authorId: author.id,
          ...course,
        },
      })
    )
  )

  // create transaction with status SUBMITTED
  await prisma.transaction.create({
    data: {
      userId: member.id,
      courseId: courses[0].id,
      authorId: courses[0].authorId,
      bankName: 'Bank Mandiri',
      bankAccountName: 'Pejuang Kode',
      bankAccountNumber: '123456789',
      amount: 25000,
      status: TRANSACTION_STATUS.SUBMITTED,
    },
  })

  // create transaction with status VERIFIED
  await prisma.transaction.create({
    data: {
      userId: member.id,
      courseId: courses[1].id,
      authorId: courses[1].authorId,
      bankName: 'Bank Mandiri',
      bankAccountName: 'Pejuang Kode',
      bankAccountNumber: '123456789',
      amount: 50000,
      status: TRANSACTION_STATUS.VERIFIED,
    },
  })

  await prisma.transaction.create({
    data: {
      userId: anotherMember.id,
      courseId: courses[2].id,
      authorId: courses[2].authorId,
      bankName: 'Bank Mandiri',
      bankAccountName: 'Pejuang Kode',
      bankAccountNumber: '123456789',
      amount: 25000,
      status: TRANSACTION_STATUS.VERIFIED,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
