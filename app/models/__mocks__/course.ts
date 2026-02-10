import { faker } from '@faker-js/faker'
import { build, perBuild } from '@jackfranklin/test-data-bot'
import { Course } from '@prisma/client'
import { CATEGORIES } from '../enum'

export const courseBuilder = build<
  Omit<Course, 'id' | 'userId' | 'authorId' | 'createdAt' | 'updatedAt'>
>({
  fields: {
    name: perBuild(() => faker.commerce.productName()),
    description: perBuild(() => faker.commerce.productDescription()),
    price: perBuild(() => faker.number.int({ min: 10000, max: 100000 })),
    image: perBuild(() => faker.image.url()),
    category: perBuild(() => CATEGORIES.PARENTING),
  },
})
