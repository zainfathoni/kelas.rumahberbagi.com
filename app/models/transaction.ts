import { db } from '~/utils/db.server'

export async function getTransactionDetails(id: string) {
  return await db.transaction.findUnique({
    where: { id },
    include: { user: true },
  })
}
