import { build, fake, perBuild } from '@jackfranklin/test-data-bot'
import { Course } from '@prisma/client'
import { CATEGORIES } from '../enum'

export const courseBuilder = build<
  Omit<Course, 'id' | 'userId' | 'authorId' | 'createdAt' | 'updatedAt'>
>({
  fields: {
    name: fake((f) => f.commerce.productName()),
    description: fake((f) => f.commerce.productDescription()),
    price: fake((f) => f.datatype.number({ min: 10000, max: 100000 })),
    image: fake((f) => f.image.imageUrl()),
    category: perBuild(() => CATEGORIES.PARENTING),
  },
})
