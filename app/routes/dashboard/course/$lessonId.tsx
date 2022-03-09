import { Link, redirect, useLoaderData, Outlet, useOutletContext } from 'remix'
import type { LoaderFunction } from 'remix'
import { Course, User } from '@prisma/client'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid'
import { PaperClipIcon } from '@heroicons/react/outline'
import { CourseContextType } from '../course'
import { getFirstCourse } from '~/models/course'
import { getLessonById, LessonWithAttachments } from '~/models/lesson'
import { requireUser } from '~/services/auth.server'
import {
  requireActiveSubscription,
  requireCourseAuthor,
} from '~/utils/permissions'
import { Handle } from '~/utils/types'
import { transformURLwithinText } from '~/utils/format'
import { getAdjacentLessonIds } from '~/utils/pagination'

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

  return { lesson, user, course }
}

export default function LessonPage() {
  const { lesson, user, course } = useLoaderData<{
    lesson: LessonWithAttachments
    user: User
    course: Course
  }>()

  const { chapters } = useOutletContext<CourseContextType>()
  const { currentChapter, nextLessonId, prevLessonId } = getAdjacentLessonIds(
    chapters,
    lesson
  )

  return (
    <div className="flex flex-col h-full w-full bg-gray-50 flex-grow">
      <nav
        className="flex items-start px-4 sm:px-6 lg:px-8 xl:hidden border-solid border-y-2 border-gray-200"
        aria-label="Kembali ke direktori"
      >
        <Link
          to="/dashboard/course"
          className="inline-flex items-center space-x-3 py-3 text-sm font-medium text-gray-900"
        >
          <ChevronLeftIcon
            className="-ml-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>{currentChapter.name}</span>
        </Link>
      </nav>
      <article className="h-full bg-gray-50 m-0 pt-2 md:pt-5 flex flex-col flex-grow">
        <h3 className="px-6 sm:px-8 pb-2 md:pb-5 text-md sm:text-lg leading-6 font-medium text-gray-900 border-b border-gray-200">
          {lesson.name}
        </h3>
        <div className="mx-0 sm:mx-8 sm:my-8 aspect-w-16 aspect-h-9 flex-none">
          <iframe
            title={lesson.name}
            className="sm:rounded-md"
            src={`https://www.youtube.com/embed/${lesson.videoId}?autoplay=1`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="mx-6 sm:mx-8 my-2 flex-grow">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 2xl:grid-cols-2">
            <div className="col-span-2 2xl:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Deskripsi</dt>
              <dd
                className="whitespace-pre-line mt-1 max-w-prose text-sm text-gray-900 space-y-5"
                dangerouslySetInnerHTML={{
                  __html: transformURLwithinText(lesson.description ?? '-'),
                }}
              ></dd>
            </div>
            {lesson.attachments.length ? (
              <div className="col-span-2 2xl:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Lampiran</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="border-solid border border-gray-200 rounded-md divide-y divide-gray-200 overflow-hidden">
                    {lesson.attachments.map((attachment) => (
                      <li
                        key={attachment.id}
                        className="pl-3 pr-4 py-3 flex items-center justify-between text-sm bg-white"
                      >
                        <div className="w-0 flex-1 flex items-center">
                          <PaperClipIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          <span className="ml-2 flex-1 w-0 truncate">
                            {attachment.name}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a
                            href={attachment.url}
                            download={attachment.name}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Unduh
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
          <div className="flex-1 flex justify-start py-4 flex-row gap-4">
            {requireCourseAuthor(user, course) && (
              <div className="flex-1 flex justify-start">
                <Link
                  to="edit"
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700'"
                >
                  Ubah
                </Link>
              </div>
            )}
            <div className="flex-1 flex justify-end">
              <a
                href="https://rbagi.id/menti"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 text-center"
              >
                Ajukan Pertanyaan
              </a>
            </div>
          </div>
        </div>
        <nav
          className="bg-white px-6 sm:px-8 flex items-center justify-between border-t border-gray-200 flex-initial gap-4"
          aria-label="Navigasi"
        >
          <div className="flex-1 flex justify-start">
            {prevLessonId ? (
              <Link
                to={`/dashboard/course/${prevLessonId}`}
                className="relative inline-flex items-center py-4 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <ChevronLeftIcon
                  className="-ml-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-2">Sebelumnya</span>
              </Link>
            ) : null}
          </div>
          <div className="flex-1 flex justify-end">
            {nextLessonId ? (
              <Link
                to={`/dashboard/course/${nextLessonId}`}
                className="relative inline-flex items-center py-4 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <span className="mr-2">Selanjutnya</span>
                <ChevronRightIcon
                  className="-ml-1 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Link>
            ) : null}
          </div>
        </nav>
      </article>
      <Outlet />
    </div>
  )
}
