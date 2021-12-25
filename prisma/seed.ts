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
  await Promise.all(
    getCourse().map((course) =>
      prisma.course.create({
        data: course,
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
      id: '82bf2c53-a9eb-4029-8d6d-17f514e8be7b',
      email: 'me@zainf.dev',
      name: 'Zain',
      phoneNumber: '+6512345678',
      role: ROLES.ADMIN,
    },
    {
      id: '76ca6998-da6a-4523-bb71-397f7472cd49',
      email: 'vika@rbagi.id',
      name: 'Vika',
      role: ROLES.AUTHOR,
    },
    {
      id: 'ace81e7d-371a-42f4-99d5-2477237cc23d',
      email: 'pk@zainf.dev',
      name: 'Pejuang Kode',
      role: ROLES.MEMBER,
    },
  ]
}

function getCourse() {
  return [
    {
      authorId: '76ca6998-da6a-4523-bb71-397f7472cd49',
      name: 'Menumbuhkan Minat Baca Anak',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      price: 25000,
      image: 'https://picsum.photos/id/1073/1200/800',
      category: 'Parenting',
    },
    {
      authorId: '76ca6998-da6a-4523-bb71-397f7472cd49',
      name: 'Mengelola Konflik dalam Keluarga',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      price: 50000,
      image: 'https://picsum.photos/id/146/1200/800',
      category: 'Parenting',
    },
    {
      authorId: '76ca6998-da6a-4523-bb71-397f7472cd49',
      name: 'Menumbuhkan Rasa Percaya Diri Sejak Dini',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      price: 100000,
      image: 'https://picsum.photos/id/1001/1200/800',
      category: 'Parenting',
    },
  ]
}
