import { redirect, useLoaderData, Outlet } from 'remix'
import type { LoaderFunction } from 'remix'
import { Chapters, getAllChapters, getFirstCourse } from '~/models/course'
import { requireUser } from '~/services/auth.server'
import { requireActiveSubscription } from '~/utils/permissions'
import { Handle } from '~/utils/types'
import { Directory } from '~/components/directory'

export const handle: Handle = { name: 'Kelas' }

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUser(request)
  const course = await getFirstCourse()

  if (!requireActiveSubscription(user, course)) {
    return redirect('/dashboard')
  }

  const chapters = await getAllChapters(course.id)

  return { chapters }
}

export default function CourseRoot() {
  const { chapters } = useLoaderData<{ chapters: Chapters }>()

  return (
    <div className="flex-1 relative z-0 flex overflow-hidden">
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
        <Outlet />
      </main>
      <aside className="hidden relative h-screen xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200 overflow-y-auto">
        <Directory label="Direktori Video">
          {chapters.map(({ id, name, lessons }) => (
            <Directory.Group key={id} name={name}>
              {lessons.map(({ id, name, description }) => (
                <Directory.Item
                  key={id}
                  to={id}
                  name={name}
                  description={description}
                />
              ))}
            </Directory.Group>
          ))}
        </Directory>
      </aside>
    </div>
  )
}
