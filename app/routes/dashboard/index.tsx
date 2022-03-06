import { useLoaderData } from 'remix'
import type { LoaderFunction } from 'remix'
import { Pricing } from '~/components/sections/pricing'
import { SUBSCRIPTION_STATUS } from '~/models/enum'
import { getFirstActiveSubcriptionByUserId } from '~/models/subscription'
import { requireUser } from '~/services/auth.server'
import { Handle } from '~/utils/types'
import { SingleColumnLayout } from '~/components/single-column-layout'

export const handle: Handle = { name: 'Beranda' }

export const loader: LoaderFunction = async ({ request }) => {
  const { id } = await requireUser(request)

  // Get the subscription data from user where status is active
  const subscription = await getFirstActiveSubcriptionByUserId(id)
  return { isSubscribed: subscription?.status === SUBSCRIPTION_STATUS.ACTIVE }
}

export default function Dashboard() {
  const { isSubscribed } = useLoaderData<{ isSubscribed: boolean }>()

  return (
    <SingleColumnLayout>
      <Pricing
        title="Biaya kelas"
        description={
          <Pricing.Description>
            Biaya baru dibayarkan setelah Anda terkonfirmasi sebagai peserta
            kelas
          </Pricing.Description>
        }
        signupLink="/dashboard/purchase"
        isSubscribed={isSubscribed}
      >
        <Pricing.Included title="Biaya termasuk">
          <Pricing.Item>Handout berupa catatan bergambar</Pricing.Item>
          <Pricing.Item>Printable planner</Pricing.Item>
          <Pricing.Item>Akses kelas online melalui Zoom</Pricing.Item>
          <Pricing.Item>Video rekaman kelas</Pricing.Item>
        </Pricing.Included>
      </Pricing>
    </SingleColumnLayout>
  )
}
