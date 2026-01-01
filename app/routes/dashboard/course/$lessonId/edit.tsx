import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useLoaderData,
  useMatches,
  useNavigate,
} from '@remix-run/react'
import { Lesson } from '@prisma/client'
import { Field } from '~/components/form-elements'
import { classNames } from '~/utils/class-names'
import { Handle } from '~/utils/types'
import { getLessonById, updateLessonDescription } from '~/models/lesson'
import { requireUser } from '~/services/auth.server'
import { getFirstCourse } from '~/models/course'
import { requireCourseAuthor } from '~/utils/permissions'

export const handle: Handle = { name: 'Edit' }

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await requireUser(request)
  const course = await getFirstCourse()

  const { lessonId } = params
  if (!lessonId) {
    return redirect('/dashboard/course')
  }

  if (!requireCourseAuthor(user, course)) {
    return redirect(`/dashboard/course/${lessonId}`)
  }

  const lesson = await getLessonById(lessonId)
  if (!lesson) {
    return redirect('/dashboard/course')
  }

  return { lesson }
}

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireUser(request)
  const course = await getFirstCourse()

  if (!requireCourseAuthor(user, course)) {
    return redirect('/dashboard/transactions')
  }

  const { lessonId } = params
  if (!lessonId) {
    return redirect('/dashboard/course')
  }

  const formData = await request.formData()
  const description = formData.get('description')

  if (typeof description !== 'string') {
    return {
      formError: 'Form not submitted correctly.',
      field: formData.entries(),
    }
  }

  const lesson = await updateLessonDescription(lessonId, description)
  if (!lesson) {
    return json(
      { lessonId, description, error: 'Failed to update lesson description' },
      { status: 500 }
    )
  }

  return redirect(`/dashboard/course/${lesson.id}`)
}

export default function EditLesson() {
  const matches = useMatches()
  const lessonId = matches[matches.length - 1]?.params?.lessonId
  const navigate = useNavigate()
  const { lesson } = useLoaderData<{ lesson: Lesson }>()

  return (
    <Transition.Root show as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() =>
          navigate(`/dashboard/course/${lessonId}`, {
            replace: true,
          })
        }
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Ubah deskripsi materi
                </h3>
                <Form replace method="post">
                  <div className="mt-5">
                    <div className="rounded-md bg-gray-50 px-6 py-5 mt-5">
                      <Field
                        type="textarea"
                        name="description"
                        label="Deskripsi"
                        placeholder="Tuliskan deskripsi sesuai dengan materi"
                        autoCapitalize="sentence"
                        rows={10}
                        defaultValue={lesson.description ?? ''}
                      />
                      <button
                        type="submit"
                        aria-label="Verifikasi"
                        className={classNames(
                          'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500',
                          'bg-indigo-600 hover:bg-indigo-700',
                          'mt-4'
                        )}
                      >
                        Ubah
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
