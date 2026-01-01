import type { LoaderFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Outlet, useLoaderData, useMatches } from '@remix-run/react'
import { ReactNode } from 'react'
import { Chapters, getAllChapters, getFirstCourse } from '~/models/course'
import { requireUpdatedUser } from '~/services/auth.server'
import { requireActiveSubscription } from '~/utils/permissions'
import { Handle } from '~/utils/types'
import { Directory } from '~/components/directory'

export const handle: Handle = { name: 'Kelas' }

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)
  const course = await getFirstCourse()

  if (!requireActiveSubscription(user, course)) {
    return redirect('/dashboard')
  }

  const chapters = await getAllChapters(course.id)

  return { chapters }
}

export type CourseContextType = {
  chapters: Chapters
  directory: ReactNode
}

export default function CourseRoot() {
  const { chapters } = useLoaderData<{ chapters: Chapters }>()
  const matches = useMatches()
  const currentLessonId = matches[matches.length - 1]?.params?.lessonId

  const directory = (
    <Directory label="Direktori Video" currentId={currentLessonId}>
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
  )

  const context: CourseContextType = { chapters, directory }

  return (
    <div className="flex-1 relative z-0 flex overflow-hidden">
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none xl:order-last">
        <Outlet context={context} />
      </main>
      <aside className="hidden relative h-screen xl:order-first xl:flex xl:flex-col flex-shrink-0 w-96 border-r border-gray-200 overflow-y-auto">
        {directory}
      </aside>
    </div>
  )
}
