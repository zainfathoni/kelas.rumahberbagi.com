import { Link } from 'remix'

export default function ProfileIndex() {
  return (
    <div className="py-4">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
        <Link
          to="/dashboard/profile/edit"
          type="button"
          className="m-6 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
        >
          Ubah
        </Link>
      </div>
    </div>
  )
}
