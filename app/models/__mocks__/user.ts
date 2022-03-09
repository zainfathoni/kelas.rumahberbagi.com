import { build, fake, perBuild } from '@jackfranklin/test-data-bot'
import { User } from '@prisma/client'
import { ROLES } from '../enum'

type OmittedUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

export interface BuiltUser extends OmittedUser {
  name: NonNullable<User['name']>
  phoneNumber: NonNullable<User['phoneNumber']>
}

export const userBuilder = build<BuiltUser>({
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
