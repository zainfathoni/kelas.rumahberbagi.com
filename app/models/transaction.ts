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

export async function getAllTransactions() {
  // TODO: refactor this code once the assumption that there is only one transaction for each user and course is no longer valid
  const course = await getFirstCourse()

  if (!course) {
    return []
  }

  return await db.transaction.findMany({
    where: {
      courseId: course.id,
    },
  })
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
