import { Link } from 'remix'

export default function ProfileIndex() {
  return (
    <div className="py-4">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
        <Link
          to="/dashboard/profile/edit"
          type="button"
          className="px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Ubah
        </Link>
      </div>
    </div>
  )
}
