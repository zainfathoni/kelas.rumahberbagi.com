import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const ROLES = {
  ADMIN: 'ADMIN',
  AUTHOR: 'AUTHOR',
  MEMBER: 'MEMBER',
}

async function main() {
  await Promise.all(
    getUsers().map((user) =>
      prisma.user.create({
        data: user,
      })
    )
  )
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

function getUsers() {
  return [
    {
      email: 'me@zainf.dev',
      name: 'Zain',
      phoneNumber: '6512345678',
      role: ROLES.ADMIN,
    },
    {
      email: 'vika@rbagi.id',
      name: 'Vika',
      phoneNumber: '6512345678',
      role: ROLES.AUTHOR,
    },
    {
      email: 'streamyard@zainf.dev',
      name: 'Streamyard',
      phoneNumber: '6512345678',
      role: ROLES.MEMBER,
    },
  ]
}
