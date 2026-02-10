import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Transaction } from '@prisma/client'
import { TRANSACTION_STATUS } from '../enum'

export const transactionBuilder = build<
  Omit<
    Transaction,
    | 'id'
    | 'userId'
    | 'courseId'
    | 'authorId'
    | 'createdAt'
    | 'updatedAt'
    | 'datetime'
    | 'notes'
  >
>({
  fields: {
    bankName: perBuild(() => faker.company.name()),
    bankAccountName: perBuild(() => faker.person.fullName()),
    bankAccountNumber: perBuild(() => faker.phone.number()),
    amount: perBuild(() => faker.number.int({ min: 10000, max: 100000 })),
    status: perBuild(() => TRANSACTION_STATUS.SUBMITTED),
  },
  traits: {
    verified: {
      overrides: { status: perBuild(() => TRANSACTION_STATUS.VERIFIED) },
    },
    rejected: {
      overrides: { status: perBuild(() => TRANSACTION_STATUS.REJECTED) },
    },
  },
})
