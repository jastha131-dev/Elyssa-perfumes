import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import { createClient } from '@sanity/client'
import type { UserAddress } from '@/lib/types'
import AddressesClient from './_components/AddressesClient'

const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export default async function AddressesPage() {
  const session = await auth()
  if (!session?.user) notFound()

  const userId = (session.user as { id: string }).id
  const addresses = await adminClient.fetch<UserAddress[]>(
    `*[_type == "address" && user._ref == $userId] | order(isDefault desc) {
      _id, label, firstName, lastName, address1, address2, city, state, country, postalCode, phone, isDefault
    }`,
    { userId }
  )

  return <AddressesClient addresses={addresses} userId={userId} />
}
