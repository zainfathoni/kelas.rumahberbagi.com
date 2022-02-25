import { build, fake, perBuild } from '@jackfranklin/test-data-bot'
import { Transaction } from '@prisma/client'
import { TRANSACTION_STATUS } from '../enum'

export const transactionBuilder = build<
  Omit<
    Transaction,
    'id' | 'userId' | 'courseId' | 'authorId' | 'createdAt' | 'updatedAt'
  >
>({
  fields: {
    bankName: fake((f) => f.company.companyName()),
    bankAccountName: fake((f) => f.name.findName()),
    bankAccountNumber: fake((f) => f.phone.phoneNumber()),
    amount: fake((f) => f.datatype.number({ min: 10000, max: 100000 })),
    datetime: fake((f) => f.date.recent()),
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
