import { build, fake, perBuild } from '@jackfranklin/test-data-bot'
import { User } from '@prisma/client'
import { ROLES } from '../enum'

export const userBuilder = build<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>({
  fields: {
    email: fake((f) => f.internet.email()),
    name: fake((f) => f.name.findName()),
    phoneNumber: fake((f) => f.phone.phoneNumber()),
    role: perBuild(() => ROLES.MEMBER),
    telegram: null,
    instagram: null,
  },
  traits: {
    admin: { overrides: { role: perBuild(() => ROLES.ADMIN) } },
    author: { overrides: { role: perBuild(() => ROLES.AUTHOR) } },
  },
})
