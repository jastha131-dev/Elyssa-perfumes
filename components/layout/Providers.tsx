'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'sonner'
import CartDrawer from '@/components/cart/CartDrawer'
import SearchOverlay from '@/components/layout/SearchOverlay'
import { QuickViewListener } from '@/components/product/QuickViewModal'
import NewsletterPopup from '@/components/layout/NewsletterPopup'
import { useCartStore } from '@/lib/store/cart-store'
import { useCartDrawerStore } from '@/lib/store/cart-drawer-store'
import type { PopupSettings } from '@/lib/types'

interface ProvidersProps {
  children: React.ReactNode
  popupSettings?: PopupSettings | null
}

function GlobalOverlays({ popupSettings }: { popupSettings?: PopupSettings | null }) {
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
      <NewsletterPopup settings={popupSettings ?? null} />
    </>
  )
}

export default function Providers({ children, popupSettings }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <GlobalOverlays popupSettings={popupSettings} />
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
    </SessionProvider>
  )
}
