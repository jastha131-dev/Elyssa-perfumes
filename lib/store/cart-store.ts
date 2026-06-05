import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product, VolumeOption } from '@/lib/types'

interface CartStore {
  items: CartItem[]

  // Actions
  addItem: (product: Product, quantity: number, selectedVolume: VolumeOption) => void
  removeItem: (productId: string, volumeMl: number) => void
  updateQuantity: (productId: string, volumeMl: number, quantity: number) => void
  clearCart: () => void

  // Gift wrap
  giftWrap: boolean
  giftMessage: string
  setGiftWrap: (v: boolean) => void
  setGiftMessage: (m: string) => void

  // Computed
  totalItems: () => number
  totalPrice: () => number
  getItem: (productId: string, volumeMl: number) => CartItem | undefined

  // Cart drawer state
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      giftWrap: false,
      giftMessage: '',
      setGiftWrap: (v) => set({ giftWrap: v }),
      setGiftMessage: (m) => set({ giftMessage: m }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product, quantity, selectedVolume) => {
        set((state) => {
          const existing = state.items.find(
            (item) =>
              item.product._id === product._id &&
              item.selectedVolume.ml === selectedVolume.ml
          )
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id &&
                item.selectedVolume.ml === selectedVolume.ml
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }
          return {
            items: [...state.items, { product, selectedVolume, quantity }],
          }
        })
      },

      removeItem: (productId, volumeMl) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.product._id === productId && item.selectedVolume.ml === volumeMl)
          ),
        }))
      },

      updateQuantity: (productId, volumeMl, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId, volumeMl)
          return
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId && item.selectedVolume.ml === volumeMl
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [], giftWrap: false, giftMessage: '' }),

      totalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce(
          (sum, item) => sum + item.selectedVolume.price * item.quantity,
          0
        ),

      getItem: (productId, volumeMl) =>
        get().items.find(
          (item) =>
            item.product._id === productId && item.selectedVolume.ml === volumeMl
        ),
    }),
    {
      name: 'luxe-cart',
      partialize: (state) => ({ items: state.items, giftWrap: state.giftWrap, giftMessage: state.giftMessage }),
    }
  )
)
