import { Outlet } from 'remix'

export default function ProfileIndex() {
  return (
    <>
      <div>
        <Outlet />
      </div>
    </>
  )
}
