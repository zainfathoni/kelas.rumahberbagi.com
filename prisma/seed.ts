import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const ROLES = {
  ADMIN: 'ADMIN',
  AUTHOR: 'AUTHOR',
  MEMBER: 'MEMBER',
}

// this is a hashed version of "twixrox"
const passwordHash = '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u'
const phoneNumber = '6512345678'

async function seed() {
  await Promise.all(
    getUsers().map((user) =>
      prisma.user.create({
        data: {
          ...user,
          passwordHash,
          phoneNumber,
        },
      })
    )
  )
}

seed()

function getUsers() {
  return [
    {
      email: 'me@zainf.dev',
      name: 'Zain',
      role: ROLES.ADMIN,
    },
    {
      email: 'vika@rbagi.id',
      name: 'Vika',
      role: ROLES.AUTHOR,
    },
    {
      email: 'streamyard@zainf.dev',
      name: 'Streamyard',
      role: ROLES.MEMBER,
    },
  ]
}
