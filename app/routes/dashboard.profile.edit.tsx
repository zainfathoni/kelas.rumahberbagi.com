import type { User } from '@prisma/client'
import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from '@remix-run/react'
import {
  getHeadersWithUpdatedUser,
  requireUpdatedUser,
  requireUser,
} from '~/services/auth.server'
import { Button, Field } from '~/components/form-elements'
import { validatePhoneNumber, validateRequired } from '~/utils/validators'
import { updateUser, UserFields } from '~/models/user'
import { Handle } from '~/utils/types'

export const handle: Handle = { name: 'Ubah Profil' }

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireUpdatedUser(request)
  return json({ user })
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
  let user = await requireUser(request)

  const form = await request.formData()
  const name = form.get('name')
  const phoneNumber = form.get('phoneNumber')
  const instagram = form.get('instagram')
  const telegram = form.get('telegram')
  const redirectTo = form.get('redirectTo') || '/dashboard/profile'

  // TODO: Use `zod` instead
  if (
    typeof name !== 'string' ||
    typeof phoneNumber !== 'string' ||
    (typeof instagram !== 'string' && typeof instagram !== 'object') ||
    (typeof telegram !== 'string' && typeof telegram !== 'object') ||
    typeof redirectTo !== 'string'
  ) {
    return {
      formError: 'Form not submitted correctly.',
      fields: form.entries(),
    }
  }

  const fieldErrors = {
    name: validateRequired('Nama Lengkap', name),
    phoneNumber: validatePhoneNumber('Nomor WhatsApp', phoneNumber),
  }
  const fields: UserFields = {
    name,
    phoneNumber: phoneNumber.trim(),
    instagram: instagram ? String(instagram) : null,
    telegram: telegram ? String(telegram) : null,
  }
  if (Object.values(fieldErrors).some(Boolean)) {
    return { fieldErrors, fields }
  }

  user = await updateUser(user.id, fields)

  const headers = await getHeadersWithUpdatedUser(request, user)

  return redirect(redirectTo, { headers })
}

const tabs = [{ name: 'Profil', href: '#', current: true }]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Settings() {
  const { user } = useLoaderData<{ user: User }>()
  const actionData = useActionData<ActionData>()
  const { state } = useNavigation()
  const [searchParams] = useSearchParams()

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
                        <input
                          type="hidden"
                          name="redirectTo"
                          value={searchParams.get('redirectTo') ?? undefined}
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
