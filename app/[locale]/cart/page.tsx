import CartPageClient from '@/app/cart/CartPageClient'

export const metadata = {
  title: 'Your Cart | Luxe Parfum',
  description: 'Review your selected fragrances and proceed to checkout.',
}

export default function CartPage() {
  return <CartPageClient />
}
