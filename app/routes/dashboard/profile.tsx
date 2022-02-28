import { Outlet } from 'remix'

export const handle = { name: 'Profil' }

export default function ProfileRoot() {
  return <Outlet />
}
