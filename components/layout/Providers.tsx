'use client'

import { Toaster } from 'sonner'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchOverlay from '@/components/layout/SearchOverlay'
import { QuickViewListener } from '@/components/product/QuickViewModal'
import { useCartStore } from '@/lib/store/cart-store'
import { useCartDrawerStore } from '@/lib/store/cart-drawer-store'

interface ProvidersProps {
  children: React.ReactNode
}

function GlobalOverlays() {
  const { isOpen: cartStoreOpen, closeCart: closeCartStore } = useCartStore()
  const { isOpen: drawerStoreOpen, closeCart: closeDrawerStore } = useCartDrawerStore()

  const isOpen = cartStoreOpen || drawerStoreOpen
  const handleClose = () => {
    closeCartStore()
    closeDrawerStore()
  }

  return (
    <>
      <CartDrawer isOpen={isOpen} onClose={handleClose} />
      <SearchOverlay />
      <QuickViewListener />
    </>
  )
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <>
      {children}
      <GlobalOverlays />
      <Toaster
        position="bottom-right"
        theme="light"
        toastOptions={{
          classNames: {
            toast:
              'font-body text-sm text-charcoal-900 bg-white border border-charcoal-100 shadow-lg rounded-xl',
            title: 'font-semibold',
            description: 'text-charcoal-500',
            actionButton:
              'bg-gold-500 text-white hover:bg-gold-600 rounded-full px-4 py-1 text-xs font-medium',
            cancelButton:
              'bg-charcoal-100 text-charcoal-600 rounded-full px-4 py-1 text-xs font-medium',
            success: 'border-l-4 border-l-gold-500',
            error: 'border-l-4 border-l-red-500',
          },
        }}
        richColors={false}
        expand={false}
        closeButton
      />
    </>
  )
}
