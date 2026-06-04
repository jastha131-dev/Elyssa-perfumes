import { getActivePromotions } from '@/lib/sanity/fetch'
import CartPageClient from '@/app/cart/CartPageClient'
import type { Promotion } from '@/lib/types'

export const metadata = {
  title: 'Your Cart | Luxe Parfum',
  description: 'Review your selected fragrances and proceed to checkout.',
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  let activePromotions: Promotion[] = []
  try {
    activePromotions = await getActivePromotions()
  } catch {
    // non-fatal — cart works without promotions
  }
  return <CartPageClient activePromotions={activePromotions} locale={locale} />
}
