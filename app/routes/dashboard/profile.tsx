import { Outlet } from 'remix'
import { SingleColumnLayout } from '~/components/single-column-layout'
import { Handle } from '~/utils/types'

export const handle: Handle = { name: 'Profil' }

export default function ProfileRoot() {
  return (
    <SingleColumnLayout>
      <Outlet />
    </SingleColumnLayout>
  )
}
