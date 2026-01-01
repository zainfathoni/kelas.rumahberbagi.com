import { VideoCameraIcon } from '@heroicons/react/outline'
import { useOutletContext } from '@remix-run/react'
import { CourseContextType } from '../course'

export default function CourseIndex() {
  const { directory } = useOutletContext<CourseContextType>()

  return (
    <div className="flex h-screen w-full">
      <div className="xl:hidden relative h-screen w-full border-r border-gray-200 overflow-y-auto">
        {directory}
      </div>
      <article className="hidden xl:block place-self-center relative w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center max-w-xl mx-auto">
        <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-500" />
        <span className="mt-2 block text-sm font-medium text-gray-900">
          Pilih salah satu video di samping untuk memulai
        </span>
      </article>
    </div>
  )
}
