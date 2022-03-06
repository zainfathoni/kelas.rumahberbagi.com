import { Link, redirect, useLoaderData, Outlet } from 'remix'
import type { LoaderFunction } from 'remix'
import { Chapters, getAllChapters, getFirstCourse } from '~/models/course'
import { requireUser } from '~/services/auth.server'
import { requireActiveSubscription } from '~/utils/permissions'
import { Handle } from '~/utils/types'

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
        <nav className="h-full overflow-y-auto" aria-label="Directory">
          {chapters.map(({ id, name, lessons }) => (
            <div key={id} className="relative">
              <div className="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500">
                <h3>{name}</h3>
              </div>
              <ul className="relative z-0 divide-y divide-gray-200">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="bg-white">
                    <div className="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                      <div className="flex-shrink-0">
                        <span
                          className="h-9 flex items-center"
                          aria-hidden="true"
                        >
                          <span className="relative w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400">
                            <span className="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300" />
                          </span>
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link to={lesson.id} className="focus:outline-none">
                          {/* Extend touch target to entire panel */}
                          <span
                            className="absolute inset-0"
                            aria-hidden="true"
                          />
                          <p className="text-sm font-medium text-gray-900">
                            {lesson.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {lesson.description}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  )
}
