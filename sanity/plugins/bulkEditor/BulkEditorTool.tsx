// sanity/plugins/bulkEditor/BulkEditorTool.tsx
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useProducts } from './useProducts'
import { useBulkMutate } from './useBulkMutate'
import { FilterBar, type FilterState } from './FilterBar'
import { ProductTable } from './ProductTable'
import { BulkActionPanel } from './BulkActionPanel'
import type { ProductRow, BulkOps } from './types'

function applyFilters(products: ProductRow[], filters: FilterState): ProductRow[] {
  return products.filter(p => {
    if (filters.search && !p.name_en.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.category && p.category?.slug !== filters.category) {
      return false
    }
    if (filters.status && (p.status ?? 'active') !== filters.status) {
      return false
    }
    if (filters.tags.length > 0 && !filters.tags.every(t => (p.tags ?? []).includes(t))) {
      return false
    }
    return true
  })
}

export function BulkEditorTool() {
  const { products, loading, error, refetch } = useProducts()
  const { apply, loading: mutating } = useBulkMutate()

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    status: '',
    tags: [],
  })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Fix 4: store toast timer ref so it can be cleared on unmount
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fix 4: cancel pending toast timer on unmount to avoid setState on unmounted component
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    }
  }, [])

  // Fix 3: clear selection whenever filters change so hidden products aren't mutated invisibly
  useEffect(() => {
    setSelected(new Set())
  }, [filters])

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters])

  const handleToggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }, [])

  const handleToggleAll = useCallback(() => {
    const ids = filtered.map(p => p._id)
    const allOn = ids.every(id => selected.has(id))
    setSelected(prev => {
      const next = new Set(prev)
      if (allOn) {
        ids.forEach(id => next.delete(id))
      } else {
        ids.forEach(id => next.add(id))
      }
      return next
    })
  }, [filtered, selected])

  const handleApply = useCallback(async (ops: BulkOps) => {
    const targets = products.filter(p => selected.has(p._id))
    const result = await apply(targets, ops)

    const ok = result.failed === 0
    const msg = ok
      ? `${result.updated} product${result.updated !== 1 ? 's' : ''} updated`
      : `${result.updated} updated, ${result.failed} failed`

    setToast({ msg, ok })
    setSelected(new Set())
    await refetch()
    // Fix 4: cancel any previous timer before setting a new one
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(null), 4000)
  }, [products, selected, apply, refetch])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: 'var(--muted-fg)', fontSize: 14 }}>
        Loading products…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: 32, color: '#dc2626', fontSize: 14 }}>
        Error loading products: {error}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontFamily: 'inherit' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid var(--card-border-color)',
        flexShrink: 0,
      }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Bulk Editor</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {selected.size > 0 && (
            <>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#4a7cf7' }}>
                {selected.size} selected
              </span>
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                style={{ fontSize: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted-fg)' }}
              >
                × Clear
              </button>
            </>
          )}
          <span style={{ fontSize: 12, color: 'var(--muted-fg)' }}>
            {filtered.length} / {products.length} products
          </span>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          padding: '10px 20px',
          background: toast.ok ? '#d1fae5' : '#fef3c7',
          color: toast.ok ? '#065f46' : '#92400e',
          fontSize: 13,
          fontWeight: 600,
          borderBottom: '1px solid var(--card-border-color)',
          flexShrink: 0,
        }}>
          {toast.ok ? '✓' : '⚠'} {toast.msg}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ flexShrink: 0 }}>
        <FilterBar products={products} filters={filters} onChange={setFilters} />
      </div>

      {/* Table (scrollable) */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <ProductTable
          products={filtered}
          selected={selected}
          onToggle={handleToggle}
          onToggleAll={handleToggleAll}
        />
        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted-fg)', fontSize: 13 }}>
            No products match current filters.
          </div>
        )}
      </div>

      {/* Bulk action panel — only when products are selected */}
      {selected.size > 0 && (
        <div style={{ flexShrink: 0 }}>
          <BulkActionPanel
            selectedCount={selected.size}
            loading={mutating}
            onApply={handleApply}
          />
        </div>
      )}

    </div>
  )
}
