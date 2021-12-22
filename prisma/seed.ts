import { PrismaClient } from '@prisma/client'
import { ROLES } from '../app/models/enum'

const prisma = new PrismaClient()

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
      phoneNumber: '+6512345678',
      role: ROLES.ADMIN,
    },
    {
      email: 'vika@rbagi.id',
      name: 'Vika',
      role: ROLES.AUTHOR,
    },
    {
      email: 'pk@zainf.dev',
      name: 'Pejuang Kode',
      role: ROLES.MEMBER,
    },
  ]
}
