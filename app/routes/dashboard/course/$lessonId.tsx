import { Link, redirect, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { Lesson } from '@prisma/client'
import { ChevronLeftIcon } from '@heroicons/react/solid'
import { getFirstCourse } from '~/models/course'
import { getLessonById } from '~/models/lesson'
import { requireUser } from '~/services/auth.server'
import { requireActiveSubscription } from '~/utils/permissions'
import { Handle } from '~/utils/types'

export const handle: Handle = { name: 'Video' }

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request)
  const course = await getFirstCourse()

  if (!requireActiveSubscription(user, course)) {
    return redirect(`/dashboard/purchase`)
  }

  const { lessonId } = params
  if (!lessonId) {
    return redirect(`/dashboard/course`)
  }

  const lesson = await getLessonById(lessonId)
  if (!lesson) {
    return redirect(`/dashboard/course`)
  }

  return { lesson }
}

export default function LessonPage() {
  const { lesson } = useLoaderData<{ lesson: Lesson }>()

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      <nav
        className="flex items-start px-4 py-3 sm:px-6 lg:px-8 xl:hidden border-solid border-y-2 border-gray-200"
        aria-label="Breadcrumb"
      >
        <Link
          to="/dashboard/course"
          className="inline-flex items-center space-x-3 text-sm font-medium text-gray-900"
        >
          <span className="absolute inset-0" aria-hidden="true" />
          <ChevronLeftIcon
            className="-ml-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>Kembali</span>
        </Link>
      </nav>
      <article className="h-full">
        <div className="bg-white m-0 py-5 border-b border-gray-200">
          <h3 className="px-6 sm:px-8 pb-5 text-lg leading-6 font-medium text-gray-900 border-b border-gray-200">
            {lesson.name}
          </h3>
          <div className="mx-0 sm:mx-8 my-8 aspect-w-16 aspect-h-9">
            <iframe
              title={lesson.name}
              className="sm:rounded-md"
              src={`https://www.youtube.com/embed/${lesson.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="mx-6 sm:mx-8 my-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
                <dd className="whitespace-pre-line mt-1 max-w-prose text-sm text-gray-900 space-y-5">
                  {lesson.description}
                </dd>
              </div>
            </dl>
          </div>
          <nav
            className="bg-white px-6 sm:px-8 pt-4 flex items-center justify-between border-t border-gray-200"
            aria-label="Pertanyaan"
          >
            <div className="flex-1 flex justify-end">
              <a
                href="https://rbagi.id/menti"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Ajukan Pertanyaan
              </a>
            </div>
          </nav>
        </div>
      </article>
    </div>
  )
}
