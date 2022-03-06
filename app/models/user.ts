import { User } from '@prisma/client'
import { db } from '~/utils/db.server'
import { ROLES } from '~/models/enum'

export type UserFields = Pick<
  User,
  'name' | 'phoneNumber' | 'telegram' | 'instagram'
>

const include = { courses: true, subscriptions: true, transactions: true }

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({ where: { email }, include })
}

export async function getUser(id: string) {
  return await db.user.findUnique({ where: { id }, include })
}

export async function updateUser(id: string, data: UserFields) {
  return await db.user.update({ where: { id }, data, include })
}

export async function createUserByEmail(email: string) {
  return await db.user.create({
    data: {
      email,
      role: ROLES.MEMBER,
    },
    include,
  })
}
