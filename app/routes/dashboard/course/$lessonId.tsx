import { redirect, useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { Lesson } from '@prisma/client'
import { getFirstCourse } from '~/models/course'
import { getLessonById } from '~/models/lesson'
import { requireUser } from '~/services/auth.server'
import { requireActiveSubscription } from '~/utils/permissions'

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
    <div className="m-8 aspect-w-16 aspect-h-9">
      <iframe
        title={lesson.name}
        src={`https://www.youtube.com/embed/${lesson.video}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  )
}
