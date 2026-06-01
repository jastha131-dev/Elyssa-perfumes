import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Promotion, CartItem } from '@/lib/types'

interface DiscountResult {
  amount: number
  label: string
  type: Promotion['type']
  promotionId: string
}

function calcDiscount(promotion: Promotion, items: CartItem[], subtotal: number, locale: string): DiscountResult | null {
  const isAr = locale === 'ar'
  const label = (isAr ? promotion.label_ar : promotion.label_en) ?? promotion.name

  const now = Date.now()
  if (promotion.validFrom && new Date(promotion.validFrom).getTime() > now) return null
  if (promotion.validUntil && new Date(promotion.validUntil).getTime() < now) return null
  if (promotion.minOrderValue && subtotal < promotion.minOrderValue) return null
  const totalQty = items.reduce((s, i) => s + i.quantity, 0)
  if (promotion.minQuantity && totalQty < promotion.minQuantity) return null

  switch (promotion.type) {
    case 'percentage':
      return { amount: (subtotal * (promotion.discountValue ?? 0)) / 100, label, type: promotion.type, promotionId: promotion._id }
    case 'fixed':
      return { amount: Math.min(promotion.discountValue ?? 0, subtotal), label, type: promotion.type, promotionId: promotion._id }
    case 'free_shipping':
      return { amount: 0, label, type: promotion.type, promotionId: promotion._id }
    case 'tiered': {
      if (!promotion.tiers?.length) return null
      const sorted = [...promotion.tiers].sort((a, b) => b.minSpend - a.minSpend)
      const matched = sorted.find((t) => subtotal >= t.minSpend)
      if (!matched) return null
      const tierLabel = (isAr ? matched.label_ar : matched.label_en) ?? label
      return { amount: (subtotal * matched.discountPercent) / 100, label: tierLabel, type: promotion.type, promotionId: promotion._id }
    }
    case 'buy_x_get_y': {
      if (!promotion.buyQuantity || !promotion.getQuantity) return null
      if (totalQty < promotion.buyQuantity) return null
      const cheapest = [...items]
        .sort((a, b) => (a.selectedVolume?.price ?? a.product.price) - (b.selectedVolume?.price ?? b.product.price))
        .slice(0, promotion.getQuantity)
      const freeAmount = cheapest.reduce((s, i) => s + (i.selectedVolume?.price ?? i.product.price) * i.quantity, 0)
      return { amount: freeAmount, label, type: promotion.type, promotionId: promotion._id }
    }
    default:
      return null
  }
}

interface PromotionsState {
  availablePromotions: Promotion[]
  enteredCode: string
  appliedPromotion: Promotion | null
  autoAppliedPromotion: Promotion | null
  discountResult: DiscountResult | null
  freeShippingThreshold: number

  setAvailablePromotions: (promos: Promotion[]) => void
  setEnteredCode: (code: string) => void
  applyCode: (code: string, items: CartItem[], subtotal: number, locale: string) => { success: boolean; message: string }
  removeCode: () => void
  recalculate: (items: CartItem[], subtotal: number, locale: string) => void
  getEffectiveDiscount: () => number
  hasFreeShipping: () => boolean
}

export const usePromotionsStore = create<PromotionsState>()(
  persist(
    (set, get) => ({
      availablePromotions: [],
      enteredCode: '',
      appliedPromotion: null,
      autoAppliedPromotion: null,
      discountResult: null,
      freeShippingThreshold: 150,

      setAvailablePromotions: (promos) => {
        const threshold = promos.find((p) => p.freeShippingThreshold)?.freeShippingThreshold ?? 150
        set({ availablePromotions: promos, freeShippingThreshold: threshold })
      },

      setEnteredCode: (code) => set({ enteredCode: code }),

      applyCode: (code, items, subtotal, locale) => {
        const { availablePromotions } = get()
        const upper = code.trim().toUpperCase()
        const promo = availablePromotions.find(
          (p) => p.code?.toUpperCase() === upper && p.isActive
        )
        if (!promo) return { success: false, message: 'Invalid or expired code.' }
        const result = calcDiscount(promo, items, subtotal, locale)
        if (!result) return { success: false, message: 'Code conditions not met.' }
        set({ appliedPromotion: promo, discountResult: result })
        return { success: true, message: `Applied: ${result.label}` }
      },

      removeCode: () => set({ appliedPromotion: null, discountResult: null, enteredCode: '' }),

      recalculate: (items, subtotal, locale) => {
        const { appliedPromotion, availablePromotions } = get()

        // Re-evaluate manual code
        if (appliedPromotion) {
          const result = calcDiscount(appliedPromotion, items, subtotal, locale)
          if (!result) {
            set({ appliedPromotion: null, discountResult: null })
          } else {
            set({ discountResult: result })
          }
          return
        }

        // Find best auto promotion (no code required)
        const autoPromos = availablePromotions.filter((p) => !p.code && p.isActive)
        let best: DiscountResult | null = null
        let bestPromo: Promotion | null = null
        for (const promo of autoPromos) {
          const result = calcDiscount(promo, items, subtotal, locale)
          if (result && (!best || result.amount > best.amount)) {
            best = result
            bestPromo = promo
          }
        }
        set({ autoAppliedPromotion: bestPromo, discountResult: best })
      },

      getEffectiveDiscount: () => get().discountResult?.amount ?? 0,

      hasFreeShipping: () => {
        const { discountResult } = get()
        return discountResult?.type === 'free_shipping'
      },
    }),
    {
      name: 'luxe-promotions',
      partialize: (s) => ({
        appliedPromotion: s.appliedPromotion,
        enteredCode: s.enteredCode,
        discountResult: s.discountResult,
      }),
    }
  )
)
