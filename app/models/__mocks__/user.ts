import { build, perBuild } from '@jackfranklin/test-data-bot'
import { User } from '@prisma/client'
import { ROLES } from '../enum'
import { mockEmail, mockName } from './mock-data'

type OmittedUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

export type BuiltUser = OmittedUser & {
  name: NonNullable<User['name']>
}

export const userBuilder = build<BuiltUser>({
  fields: {
    email: perBuild(mockEmail),
    name: perBuild(() => mockName('User')),
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
