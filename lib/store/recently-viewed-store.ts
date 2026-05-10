import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/lib/types'

const MAX_ITEMS = 10

interface RecentlyViewedStore {
  products: Product[]

  // Actions
  addProduct: (product: Product) => void
  clearAll: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      products: [],

      addProduct: (product) => {
        const current = get().products.filter((p) => p._id !== product._id)
        set({ products: [product, ...current].slice(0, MAX_ITEMS) })
      },

      clearAll: () => set({ products: [] }),
    }),
    {
      name: 'luxe-recently-viewed',
      partialize: (state) => ({ products: state.products }),
    }
  )
)
