import { User } from '@prisma/client'
import { Form, Link } from 'remix'

export function AuthForm({
  type,
  user,
  magicLinkSent = false,
}: {
  type: 'LOGIN' | 'SIGNUP'
  user?: User
  magicLinkSent?: boolean
}) {
  const isLogin = type === 'LOGIN'
  return (
    <div className="min-h-full flex max-w-7xl mx-auto">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 lg:px-8 lg:flex-none">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              {isLogin ? 'Masuk ke akun Anda' : 'Buat akun baru'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              atau{' '}
              <Link to={isLogin ? '/signup' : '/login'} className="font-medium text-indigo-600 hover:text-indigo-500">
                {isLogin ? 'buat akun baru' : 'masuk ke akun Anda'}
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <Form action={isLogin ? '/login' : '/signup'} method="post" className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Alamat email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      defaultValue={user?.email ?? ''}
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={magicLinkSent}
                    className="disabled:opacity-50 disabled:cursor-not-allowed w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Kirim link {isLogin ? 'login' : 'pendaftaran'} ke alamat email
                  </button>
                </div>
              </Form>
              {magicLinkSent ? (
                <div className="flex items-center justify-center py-2">
                  <div className="text-sm">
                    <span className="font-medium">
                      ✨ Link {isLogin ? 'login' : 'pendaftaran'} telah dikirim ke alamat email Anda ✨
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <img className="absolute inset-0 h-full w-full object-contain" src="/rumah-berbagi.svg" alt="Rumah Berbagi" />
      </div>
    </div>
  )
}
