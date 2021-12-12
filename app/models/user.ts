import { db } from '~/utils/db.server'

export const ROLES = {
  ADMIN: 'ADMIN',
  AUTHOR: 'AUTHOR',
  MEMBER: 'MEMBER',
}

export async function getUserByEmail(email: string) {
  return await db.user.findUnique({ where: { email } })
}

// TODO: Replace dummy data with real data
export async function createUserByEmail(email: string) {
  return await db.user.create({
    data: {
      email,
      name: 'John Doe',
      role: ROLES.MEMBER,
    },
  })
}
