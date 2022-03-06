import { build, fake, perBuild } from '@jackfranklin/test-data-bot'
import { User } from '@prisma/client'
import { ROLES } from '../enum'

export const userBuilder = build<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({
  fields: {
    email: fake((f) => f.internet.email()),
    name: fake((f) => f.name.findName()),
    role: perBuild(() => ROLES.MEMBER),
    phoneNumber: perBuild(() => '+6512345678'),
    telegram: null,
    instagram: null,
  },
  traits: {
    admin: {
      overrides: {
        role: perBuild(() => ROLES.ADMIN),
        email: 'admin@rumahberbagi.com',
      },
    },
    author: {
      overrides: {
        role: perBuild(() => ROLES.AUTHOR),
        email: 'author@rumahberbagi.com',
      },
    },
    member: {
      overrides: {
        role: perBuild(() => ROLES.MEMBER),
        email: 'member@rumahberbagi.com',
      },
    },
  },
})
