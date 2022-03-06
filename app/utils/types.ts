import { Course, User } from '@prisma/client'
import { UserWithSubscriptions } from '~/models/user'

export type Handle = {
  name: string
}

export type SideNavigationItem = {
  name: string
  href: string
  icon: React.FC<{ className: string }>
  permission?:
    | ((user: User, course?: Course) => boolean)
    | ((user: UserWithSubscriptions, course?: Course) => boolean)
}
