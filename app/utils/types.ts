import { Course, User } from '@prisma/client'
import { UserWithSubscriptions } from '~/models/user'

/**
 * Utility type to convert Date fields to strings (for JSON serialization in Remix v2)
 */
export type Serialized<T> = T extends Date
  ? string
  : T extends Date | null
  ? string | null
  : T extends Array<infer U>
  ? Array<Serialized<U>>
  : T extends object
  ? { [K in keyof T]: Serialized<T[K]> }
  : T

export type Handle = {
  name: string
}

export type SideNavigationItem = {
  name: string
  href: string
  icon: React.FC<{ className: string }>
  permission?:
    | ((user: Serialized<User>, course?: Serialized<Course>) => boolean)
    | ((
        user: Serialized<UserWithSubscriptions>,
        course?: Serialized<Course>
      ) => boolean)
}
