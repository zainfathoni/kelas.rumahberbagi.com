import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Transaction } from '@prisma/client'
import { TRANSACTION_STATUS } from '../enum'
import { mockBankAccountNumber, mockName, randomInt } from './mock-data'

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
    bankName: perBuild(() => mockName('Bank')),
    bankAccountName: perBuild(() => mockName('Account Holder')),
    bankAccountNumber: perBuild(mockBankAccountNumber),
    amount: perBuild(() => randomInt(10_000, 100_000)),
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
