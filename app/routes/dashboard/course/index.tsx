import { VideoCameraIcon } from '@heroicons/react/outline'

export default function CourseIndex() {
  return (
    <article className="flex h-screen w-full px-12 max-w-3xl mx-auto">
      <div className="place-self-center relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-12 text-center">
        <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-500" />
        <span className="mt-2 block text-sm font-medium text-gray-900">
          Pilih salah satu video di samping untuk memulai
        </span>
      </div>
    </article>
  )
}
