import type { User } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from 'remix'
import {
  redirect,
  useActionData,
  useTransition,
  Form,
  json,
  useLoaderData,
} from 'remix'
import { auth } from '~/services/auth.server'
import { Button, Field } from '~/components/form-elements'
import { validatePhoneNumber, validateRequired } from '~/utils/validators'
import { db } from '~/utils/db.server'
import { getUser } from '~/models/user'
import { commitSession, getSession, logout } from '~/services/session.server'

export const handle = { name: 'Ubah Profil' }

export const loader: LoaderFunction = async ({ request }) => {
  // If the user is here, it's already authenticated, if not redirect them to
  // the login page.
  const { id } = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  // Get the user data from the database.
  const user = await getUser(id)
  if (!user) {
    return logout(request)
  }
  return json({ user })
}

interface UserFields {
  name: string
  phoneNumber: string
  instagram: string | null
  telegram: string | null
}

type ActionData = {
  formError?: string
  fieldErrors?: {
    name: string | undefined
    phoneNumber: string | undefined
    instagram: string | undefined
    telegram: string | undefined
  }
  fields?: UserFields
}

export const action: ActionFunction = async ({ request }) => {
  let user = await auth.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const form = await request.formData()
  const name = form.get('name')
  const phoneNumber = form.get('phoneNumber')
  const instagram = form.get('instagram')
  const telegram = form.get('telegram')
  // TODO: Use `zod` instead
  if (
    typeof name !== 'string' ||
    typeof phoneNumber !== 'string' ||
    (typeof instagram !== 'string' && typeof instagram !== 'object') ||
    (typeof telegram !== 'string' && typeof telegram !== 'object')
  ) {
    return { formError: 'Form not submitted correctly.' }
  }

  const fieldErrors = {
    name: validateRequired('Nama Lengkap', name),
    phoneNumber: validatePhoneNumber('Nomor WhatsApp', phoneNumber),
  }
  const fields: UserFields = {
    name,
    phoneNumber,
    instagram: instagram ? String(instagram) : null,
    telegram: telegram ? String(telegram) : null,
  }
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields }
  }

  user = await db.user.update({ where: { id: user.id }, data: fields })

  // manually get the session
  const session = await getSession(request.headers.get('cookie'))
  // and store the user data
  session.set(auth.sessionKey, user)

  const headers = new Headers({
    'Set-Cookie': await commitSession(session),
  })

  return redirect('/dashboard/profile', { headers })
}

const tabs = [{ name: 'Profil', href: '#', current: true }]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const { user } = useLoaderData<{ user: User }>()
  const actionData = useActionData<ActionData>()
  const { state } = useTransition()

  return (
    <div className="relative max-w-4xl mx-auto md:px-8 xl:px-0">
      <div className="pt-10 pb-16">
        <div className="px-4 sm:px-6 md:px-0">
          <h1 className="text-3xl font-extrabold text-gray-900">Pengaturan</h1>
        </div>
        <div className="px-4 sm:px-6 md:px-0">
          <div className="py-6">
            {/* Tabs */}
            <div className="lg:hidden">
              <label htmlFor="selected-tab" className="sr-only">
                Select a tab
              </label>
              <select
                id="selected-tab"
                name="selected-tab"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                defaultValue={tabs.find((tab) => tab.current)?.name}
              >
                {tabs.map((tab) => (
                  <option key={tab.name}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden lg:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {tabs.map((tab) => (
                    <a
                      key={tab.name}
                      href={tab.href}
                      className={classNames(
                        tab.current
                          ? 'border-purple-500 text-purple-600'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                      )}
                    >
                      {tab.name}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Description list with inline editing */}
          <div className="mt-10 sm:mt-0">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Data Diri
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Untuk keperluan proses administrasi akun Anda.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <Form action="/dashboard/profile/edit" method="post">
                  <div className="shadow overflow-hidden sm:rounded-md">
                    <div className="px-4 py-5 bg-white sm:p-6">
                      <div className="grid grid-cols-6 gap-6">
                        <Field
                          className="col-span-6"
                          name="name"
                          label="Nama Lengkap"
                          placeholder="Cantumkan nama lengkap Anda"
                          defaultValue={user.name ?? ''}
                          autoComplete="name"
                          autoCapitalize="words"
                          required
                          aria-invalid={user.name ? 'false' : 'true'}
                        />
                        <Field
                          className="col-span-6 lg:col-span-3"
                          name="email"
                          label="Alamat Email"
                          placeholder="alamat.email@gmail.com"
                          defaultValue={user.email}
                          readOnly
                          autoComplete="tel"
                        />
                        <Field
                          className="col-span-6 lg:col-span-3"
                          name="phoneNumber"
                          label="Nomor WhatsApp"
                          placeholder="+6281234567890"
                          defaultValue={
                            actionData?.fields?.phoneNumber ??
                            user.phoneNumber ??
                            ''
                          }
                          error={actionData?.fieldErrors?.phoneNumber}
                          validator={validatePhoneNumber}
                          required
                          autoComplete="tel"
                          instruction="Untuk komunikasi terkait pembayaran"
                        />
                        <Field
                          className="col-span-6 lg:col-span-3"
                          name="telegram"
                          label="Username Telegram"
                          placeholder="@username"
                          defaultValue={user.telegram ?? ''}
                          autoComplete="nickname"
                          instruction="Untuk mengundang Anda ke grup Telegram"
                        />
                        <Field
                          className="col-span-6 lg:col-span-3"
                          name="instagram"
                          label="Username Instagram"
                          placeholder="@user.name"
                          defaultValue={user.instagram ?? ''}
                          autoComplete="nickname"
                        />
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                      <Button
                        type="submit"
                        disabled={state === 'submitting'}
                        className="inline-flex"
                      >
                        Simpan
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
