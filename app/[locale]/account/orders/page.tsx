import { auth } from '@/auth'
import { notFound } from 'next/navigation'
import { createClient } from '@sanity/client'
import type { Order } from '@/lib/types'
import OrdersClient from './_components/OrdersClient'

const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) notFound()

  const userId = (session.user as { id: string }).id
  const orders = await adminClient.fetch<Order[]>(
    `*[_type == "order" && user._ref == $userId] | order(placedAt desc) {
      _id, stripeSessionId, status, items, subtotal, discount, shipping, total,
      currency, shippingAddress, trackingNumber, trackingUrl, placedAt
    }`,
    { userId }
  )

  return <OrdersClient orders={orders} />
}
