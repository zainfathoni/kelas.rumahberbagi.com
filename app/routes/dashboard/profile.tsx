import { Outlet } from 'remix'
import { Handle } from '~/utils/types'

export const handle: Handle = { name: 'Profil' }

export default function ProfileRoot() {
  return <Outlet />
}
