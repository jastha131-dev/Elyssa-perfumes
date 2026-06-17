import { useClient } from 'sanity'
import { useState, useCallback } from 'react'
import type { ProductRow, BulkOps } from './types'

export interface MutateResult {
  updated: number
  failed: number
  failedIds: string[]
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function useBulkMutate() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MutateResult | null>(null)

  // Fix 5: wrap entire body in try/finally to guarantee setLoading(false) on sync throw
  const apply = useCallback(async (
    products: ProductRow[],
    ops: BulkOps
  ): Promise<MutateResult> => {
    setLoading(true)
    setResult(null)
    try {
      const settled = await Promise.allSettled(
        products.map(product => {
          const patch = client.patch(product._id)

          // Fix 1: compute new base price up front so compareAt uses the POST-change price
          let newBasePrice = product.price
          if (ops.priceMode === 'pct' && ops.priceValue !== undefined) {
            newBasePrice = round2(product.price * (1 + ops.priceValue / 100))
          } else if (ops.priceMode === 'flat' && ops.priceValue !== undefined) {
            newBasePrice = round2(Math.max(0, product.price + ops.priceValue))
          }

          // ── Price % change ────────────────────────────────────────────────
          if (ops.priceMode === 'pct' && ops.priceValue !== undefined) {
            const f = 1 + ops.priceValue / 100
            patch.set({ price: newBasePrice })
            product.volume?.forEach((v, i) => {
              patch.set({ [`volume[${i}].price`]: round2(v.price * f) })
            })
          }

          // ── Price flat change ─────────────────────────────────────────────
          if (ops.priceMode === 'flat' && ops.priceValue !== undefined) {
            patch.set({ price: newBasePrice })
            product.volume?.forEach((v, i) => {
              patch.set({ [`volume[${i}].price`]: round2(Math.max(0, v.price + ops.priceValue!)) })
            })
          }

          // ── compareAt ─────────────────────────────────────────────────────
          if (ops.compareAtMarkupPct !== undefined) {
            // Uses newBasePrice (post-change) so compareAt reflects the updated price
            patch.set({ compareAtPrice: round2(newBasePrice * (1 + ops.compareAtMarkupPct / 100)) })
          }
          if (ops.clearSale) {
            patch.unset(['compareAtPrice'])
          }

          // ── Flags ─────────────────────────────────────────────────────────
          if (ops.new !== null && ops.new !== undefined) {
            patch.set({ new: ops.new })
          }
          if (ops.bestSeller !== null && ops.bestSeller !== undefined) {
            patch.set({ bestSeller: ops.bestSeller })
          }
          if (ops.inStock !== null && ops.inStock !== undefined) {
            patch.set({ inStock: ops.inStock })
          }
          if (ops.status !== null && ops.status !== undefined) {
            patch.set({ status: ops.status })
          }

          // ── Tags: add (dedup) ─────────────────────────────────────────────
          if (ops.addTags && ops.addTags.length > 0) {
            // Dedup is checked against the last-fetched snapshot. Concurrent sessions
            // or rapid re-apply before refetch completes can still produce duplicates.
            const existing = product.tags ?? []
            const toAdd = ops.addTags.filter(t => !existing.includes(t))
            if (toAdd.length > 0) {
              patch.setIfMissing({ tags: [] })
              patch.append('tags', toAdd)
            }
          }

          // ── Tags: remove ──────────────────────────────────────────────────
          if (ops.removeTags && ops.removeTags.length > 0) {
            ops.removeTags.forEach(tag => {
              patch.unset([`tags[@ == "${tag}"]`])
            })
          }

          // ── Badge ─────────────────────────────────────────────────────────
          if (ops.badgeText_en !== undefined && ops.badgeText_en !== '') {
            patch.set({ badgeText_en: ops.badgeText_en })
          }
          if (ops.badgeText_ar !== undefined && ops.badgeText_ar !== '') {
            patch.set({ badgeText_ar: ops.badgeText_ar })
          }
          if (ops.badgeColor !== null && ops.badgeColor !== undefined && ops.badgeColor !== '') {
            patch.set({ badgeColor: ops.badgeColor })
          }

          return patch.commit()
        })
      )

      const failedIds = settled
        .map((r, i) => ({ r, id: products[i]._id }))
        .filter(({ r }) => r.status === 'rejected')
        .map(({ id }) => id)

      const mutateResult: MutateResult = {
        updated: settled.filter(r => r.status === 'fulfilled').length,
        failed: failedIds.length,
        failedIds,
      }

      setResult(mutateResult)
      return mutateResult
    } finally {
      setLoading(false)
    }
  }, [client])

  return { apply, loading, result }
}
