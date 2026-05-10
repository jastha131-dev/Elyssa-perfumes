import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, WishlistItem } from '@/lib/types'

interface WishlistStore {
  items: WishlistItem[]

  // Actions
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (product: Product) => void
  isInWishlist: (productId: string) => boolean

  // Aliases kept for backwards compatibility
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  clearWishlist: () => void
  totalItems: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToWishlist: (product) => {
        if (get().isInWishlist(product._id)) return
        set((state) => ({
          items: [...state.items, { product, addedAt: new Date() }],
        }))
      },

      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        }))
      },

      toggleWishlist: (product) => {
        if (get().isInWishlist(product._id)) {
          get().removeFromWishlist(product._id)
        } else {
          get().addToWishlist(product)
        }
      },

      isInWishlist: (productId) =>
        get().items.some((item) => item.product._id === productId),

      // Aliases
      addItem: (product) => get().addToWishlist(product),
      removeItem: (productId) => get().removeFromWishlist(productId),

      clearWishlist: () => set({ items: [] }),

      totalItems: () => get().items.length,
    }),
    {
      name: 'luxe-wishlist',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
