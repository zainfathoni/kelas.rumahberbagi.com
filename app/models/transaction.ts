import { getFirstCourse } from './course'
import { TransactionStatus, TRANSACTION_STATUS } from './enum'
import { db } from '~/utils/db.server'

export async function getFirstTransaction(userId: string) {
  // TODO: refactor this code once the assumption that there is only one transaction for each user and course is no longer valid
  const course = await getFirstCourse()

  if (!course) {
    return null
  }

  return await db.transaction.findFirst({
    where: {
      userId,
      courseId: course.id,
    },
  })
}

export interface AllTransactionsCount {
  total: number
  submitted: number
  verified: number
  rejected: number
}

export async function countAllTransactions(): Promise<AllTransactionsCount> {
  // TODO: refactor this code once the assumption that there is only one transaction for each user and course is no longer valid
  const course = await getFirstCourse()

  if (!course) {
    return {
      total: 0,
      submitted: 0,
      verified: 0,
      rejected: 0,
    }
  }

  const [submitted, verified, rejected] = await Promise.all([
    db.transaction.count({
      where: { courseId: course.id, status: TRANSACTION_STATUS.SUBMITTED },
    }),
    db.transaction.count({
      where: { courseId: course.id, status: TRANSACTION_STATUS.VERIFIED },
    }),
    db.transaction.count({
      where: { courseId: course.id, status: TRANSACTION_STATUS.REJECTED },
    }),
  ])

  return {
    total: submitted + verified + rejected,
    submitted,
    verified,
    rejected,
  }
}

export async function getAllTransactions(status?: TransactionStatus) {
  // TODO: refactor this code once the assumption that there is only one transaction for each user and course is no longer valid
  const course = await getFirstCourse()

  if (!course) {
    return []
  }

  console.log(status)

  const where = status
    ? { status, courseId: course.id }
    : { courseId: course.id }

  return await db.transaction.findMany({ where })
}

export async function getTransactionDetails(id: string) {
  return await db.transaction.findUnique({
    where: { id },
    include: { user: true, course: true },
  })
}

export async function updateTransactionStatus(
  id: string,
  status: TransactionStatus
) {
  return await db.transaction.update({
    where: { id },
    data: { status },
  })
}
