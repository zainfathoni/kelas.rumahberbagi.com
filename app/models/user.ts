import { db } from '~/utils/db.server'
import { ROLES } from '~/models/enum'

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({ where: { email } })
}

export async function getUser(id: string) {
  return await db.user.findUnique({ where: { id } })
}

export async function createUserByEmail(email: string) {
  return await db.user.create({
    data: {
      email,
      role: ROLES.MEMBER,
    },
  })
}
