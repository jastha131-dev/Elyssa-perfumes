# Bulk Product Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Sanity Studio plugin that adds a "Bulk Editor" sidebar tool for selecting multiple products and applying batch operations.

**Architecture:** A `definePlugin` registers a custom `defineTool` in Studio's sidebar. A root React component (`BulkEditorTool`) owns filter + selection state, delegates data fetching to `useProducts` (GROQ via `useClient`), and mutation batching to `useBulkMutate` (patches via `Promise.allSettled`). All 8 files live in `sanity/plugins/bulkEditor/`. The plugin is registered in `sanity.config.ts`.

**Tech Stack:** Sanity v3.65.1, `sanity` SDK hooks (`useClient`), `@sanity/icons`, React 18, TypeScript

## Global Constraints

- Use `useClient({ apiVersion: '2024-01-01' })` from `'sanity'` — never import `writeClient` from `lib/sanity/client.ts` inside Studio components
- All inline styles (no Tailwind) — Studio has its own CSS variables: `--card-bg`, `--card-fg`, `--card-border-color`, `--muted-fg`
- Sanity v3 plugin API: `definePlugin` from `'sanity'` — NOT `createPlugin`
- `@sanity/icons` is bundled with Sanity v3 — use `LayersIcon` from `'@sanity/icons'`
- Prices rounded to 2 decimal places: `Math.round(n * 100) / 100`
- Volume array shape: `{ ml: number, price: number, sku?: string, isSample?: boolean, stockQty?: number }`
- All operations are additive — unset fields = skip, never overwrite with undefined
- No unit test runner is configured for the Sanity Studio — verification is TypeScript compile check + manual Studio inspection

---

## File Map

| File | Create/Modify | Responsibility |
|---|---|---|
| `sanity/plugins/bulkEditor/types.ts` | Create | `ProductRow`, `VolumeOption`, `BulkOps` types |
| `sanity/plugins/bulkEditor/useProducts.ts` | Create | GROQ fetch + `refetch()` |
| `sanity/plugins/bulkEditor/useBulkMutate.ts` | Create | Batched Sanity patches, `MutateResult` |
| `sanity/plugins/bulkEditor/FilterBar.tsx` | Create | Search + category/status/tags dropdowns |
| `sanity/plugins/bulkEditor/ProductTable.tsx` | Create | Checkbox table, thumbnail, status badges |
| `sanity/plugins/bulkEditor/BulkActionPanel.tsx` | Create | All 8 op sections + Apply button |
| `sanity/plugins/bulkEditor/BulkEditorTool.tsx` | Create | Root component — owns state, wires all parts |
| `sanity/plugins/bulkEditor/index.tsx` | Create | `definePlugin` + `defineTool` registration |
| `sanity.config.ts` | Modify | Import + register `bulkEditorPlugin` |

---

### Task 1: Types + Data Layer

**Files:**
- Create: `sanity/plugins/bulkEditor/types.ts`
- Create: `sanity/plugins/bulkEditor/useProducts.ts`

**Interfaces:**
- Produces: `ProductRow`, `VolumeOption`, `BulkOps` (used by every other file)
- Produces: `useProducts()` → `{ products: ProductRow[], loading: boolean, error: string | null, refetch: () => Promise<void> }`

- [ ] **Step 1: Create `types.ts`**

```ts
// sanity/plugins/bulkEditor/types.ts

export interface VolumeOption {
  ml: number
  price: number
  sku?: string
  isSample?: boolean
  stockQty?: number
}

export interface ProductCategory {
  name_en: string
  slug: string
}

export interface ProductRow {
  _id: string
  name_en: string
  name_ar?: string
  slug: { current: string }
  price: number
  compareAtPrice?: number
  volume?: VolumeOption[]
  status?: 'active' | 'draft' | 'archived'
  new?: boolean
  bestSeller?: boolean
  inStock?: boolean
  tags?: string[]
  badgeText_en?: string
  badgeText_ar?: string
  badgeColor?: string
  category?: ProductCategory
  thumb?: string
}

export interface BulkOps {
  // Price
  priceMode?: 'pct' | 'flat'
  priceValue?: number          // positive = increase, negative = decrease
  compareAtMarkupPct?: number  // compareAtPrice = price * (1 + pct/100)
  clearSale?: boolean

  // Flags — undefined/null = skip
  new?: boolean | null
  bestSeller?: boolean | null
  inStock?: boolean | null
  status?: 'active' | 'draft' | 'archived' | null

  // Tags
  addTags?: string[]
  removeTags?: string[]

  // Badge
  badgeText_en?: string
  badgeText_ar?: string
  badgeColor?: string | null
}
```

- [ ] **Step 2: Create `useProducts.ts`**

```ts
// sanity/plugins/bulkEditor/useProducts.ts
import { useClient } from 'sanity'
import { useState, useEffect, useCallback } from 'react'
import type { ProductRow } from './types'

const QUERY = `*[_type == "product"] | order(name_en asc) {
  _id, name_en, name_ar, slug, price, compareAtPrice,
  volume, status, "new": new, bestSeller, inStock, tags,
  badgeText_en, badgeText_ar, badgeColor,
  "category": category->{ name_en, "slug": slug.current },
  "thumb": images[0].asset->url
}`

export function useProducts() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [products, setProducts] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await client.fetch<ProductRow[]>(QUERY)
      setProducts(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [client])

  useEffect(() => { fetch() }, [fetch])

  return { products, loading, error, refetch: fetch }
}
```

- [ ] **Step 3: TypeScript compile check**

```bash
cd /Users/californiamediadubai/Desktop/test/p1test
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors in `sanity/plugins/bulkEditor/types.ts` or `useProducts.ts`

- [ ] **Step 4: Commit**

```bash
git add sanity/plugins/bulkEditor/types.ts sanity/plugins/bulkEditor/useProducts.ts
git commit -m "feat(bulk-editor): types + useProducts data hook"
```

---

### Task 2: useBulkMutate Hook

**Files:**
- Create: `sanity/plugins/bulkEditor/useBulkMutate.ts`

**Interfaces:**
- Consumes: `ProductRow`, `BulkOps` from `'./types'`
- Produces: `useBulkMutate()` → `{ apply: (products: ProductRow[], ops: BulkOps) => Promise<MutateResult>, loading: boolean, result: MutateResult | null }`
- Produces: `MutateResult` → `{ updated: number, failed: number, failedIds: string[] }`

- [ ] **Step 1: Create `useBulkMutate.ts`**

```ts
// sanity/plugins/bulkEditor/useBulkMutate.ts
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

  const apply = useCallback(async (
    products: ProductRow[],
    ops: BulkOps
  ): Promise<MutateResult> => {
    setLoading(true)
    setResult(null)

    const settled = await Promise.allSettled(
      products.map(product => {
        const patch = client.patch(product._id)

        // ── Price % change ────────────────────────────────────────────────
        if (ops.priceMode === 'pct' && ops.priceValue !== undefined) {
          const f = 1 + ops.priceValue / 100
          patch.set({ price: round2(product.price * f) })
          product.volume?.forEach((v, i) => {
            patch.set({ [`volume[${i}].price`]: round2(v.price * f) })
          })
        }

        // ── Price flat change ─────────────────────────────────────────────
        if (ops.priceMode === 'flat' && ops.priceValue !== undefined) {
          patch.set({ price: round2(Math.max(0, product.price + ops.priceValue)) })
          product.volume?.forEach((v, i) => {
            patch.set({ [`volume[${i}].price`]: round2(Math.max(0, v.price + ops.priceValue!)) })
          })
        }

        // ── compareAt ─────────────────────────────────────────────────────
        if (ops.compareAtMarkupPct !== undefined) {
          patch.set({ compareAtPrice: round2(product.price * (1 + ops.compareAtMarkupPct / 100)) })
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

    setLoading(false)
    setResult(mutateResult)
    return mutateResult
  }, [client])

  return { apply, loading, result }
}
```

- [ ] **Step 2: TypeScript compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors in `useBulkMutate.ts`

- [ ] **Step 3: Commit**

```bash
git add sanity/plugins/bulkEditor/useBulkMutate.ts
git commit -m "feat(bulk-editor): useBulkMutate hook — batched Sanity patches"
```

---

### Task 3: FilterBar + ProductTable Components

**Files:**
- Create: `sanity/plugins/bulkEditor/FilterBar.tsx`
- Create: `sanity/plugins/bulkEditor/ProductTable.tsx`

**Interfaces:**
- Consumes: `ProductRow` from `'./types'`
- Produces: `FilterState` type, `FilterBar` component — `{ products, filters, onChange }`
- Produces: `ProductTable` component — `{ products, selected: Set<string>, onToggle, onToggleAll }`

- [ ] **Step 1: Create `FilterBar.tsx`**

```tsx
// sanity/plugins/bulkEditor/FilterBar.tsx
import React from 'react'
import type { ProductRow } from './types'

export interface FilterState {
  search: string
  category: string
  status: string
  tags: string[]
}

interface FilterBarProps {
  products: ProductRow[]
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const inputStyle: React.CSSProperties = {
  padding: '5px 10px',
  fontSize: 12,
  border: '1px solid var(--card-border-color)',
  borderRadius: 4,
  background: 'var(--card-bg)',
  color: 'var(--card-fg)',
}

export function FilterBar({ products, filters, onChange }: FilterBarProps) {
  const categories = Array.from(
    new Set(products.map(p => p.category?.slug).filter((s): s is string => Boolean(s)))
  )
  const categoryNames = Object.fromEntries(
    products
      .filter(p => p.category?.slug)
      .map(p => [p.category!.slug, p.category!.name_en])
  )
  const allTags = Array.from(
    new Set(products.flatMap(p => p.tags ?? []))
  ).sort()

  return (
    <div style={{ display: 'flex', gap: 8, padding: '10px 16px', borderBottom: '1px solid var(--card-border-color)', flexWrap: 'wrap' }}>
      <input
        type="text"
        placeholder="Search by name…"
        value={filters.search}
        onChange={e => onChange({ ...filters, search: e.target.value })}
        style={{ ...inputStyle, flex: 1, minWidth: 160 }}
      />
      <select
        value={filters.category}
        onChange={e => onChange({ ...filters, category: e.target.value })}
        style={inputStyle}
      >
        <option value="">All Categories</option>
        {categories.map(slug => (
          <option key={slug} value={slug}>{categoryNames[slug] ?? slug}</option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={e => onChange({ ...filters, status: e.target.value })}
        style={inputStyle}
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </select>
      <select
        value={filters.tags[0] ?? ''}
        onChange={e => onChange({ ...filters, tags: e.target.value ? [e.target.value] : [] })}
        style={inputStyle}
      >
        <option value="">All Tags</option>
        {allTags.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 2: Create `ProductTable.tsx`**

```tsx
// sanity/plugins/bulkEditor/ProductTable.tsx
import React, { useRef, useEffect } from 'react'
import type { ProductRow } from './types'

interface ProductTableProps {
  products: ProductRow[]
  selected: Set<string>
  onToggle: (id: string) => void
  onToggleAll: () => void
}

const STATUS_STYLE: Record<string, React.CSSProperties> = {
  active:   { background: '#d1fae5', color: '#065f46' },
  draft:    { background: '#fef3c7', color: '#92400e' },
  archived: { background: '#fee2e2', color: '#991b1b' },
}

function IndeterminateCheckbox({ checked, indeterminate, onChange }: {
  checked: boolean
  indeterminate: boolean
  onChange: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate
  }, [indeterminate])
  return <input ref={ref} type="checkbox" checked={checked} onChange={onChange} />
}

export function ProductTable({ products, selected, onToggle, onToggleAll }: ProductTableProps) {
  const allSelected = products.length > 0 && products.every(p => selected.has(p._id))
  const someSelected = products.some(p => selected.has(p._id)) && !allSelected

  const thStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--muted-fg)',
    textAlign: 'left',
    borderBottom: '1px solid var(--card-border-color)',
    whiteSpace: 'nowrap',
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <thead>
        <tr>
          <th style={{ ...thStyle, width: 36 }}>
            <IndeterminateCheckbox
              checked={allSelected}
              indeterminate={someSelected}
              onChange={onToggleAll}
            />
          </th>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Price</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Category</th>
          <th style={thStyle}>Tags</th>
          <th style={thStyle}>Flags</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => {
          const isSelected = selected.has(p._id)
          const statusKey = p.status ?? 'active'
          return (
            <tr
              key={p._id}
              onClick={() => onToggle(p._id)}
              style={{
                borderBottom: '1px solid var(--card-border-color)',
                background: isSelected ? 'rgba(99,130,230,0.08)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <td style={{ padding: '8px 12px' }}>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(p._id)}
                  onClick={e => e.stopPropagation()}
                />
              </td>
              <td style={{ padding: '8px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {p.thumb && (
                    <img
                      src={p.thumb}
                      alt=""
                      style={{ width: 30, height: 30, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }}
                    />
                  )}
                  <span style={{ fontWeight: 500 }}>{p.name_en}</span>
                </div>
              </td>
              <td style={{ padding: '8px 12px', whiteSpace: 'nowrap' }}>
                ${p.price.toFixed(2)}
              </td>
              <td style={{ padding: '8px 12px' }}>
                <span style={{
                  padding: '2px 7px',
                  borderRadius: 3,
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  ...(STATUS_STYLE[statusKey] ?? STATUS_STYLE.active),
                }}>
                  {statusKey}
                </span>
              </td>
              <td style={{ padding: '8px 12px', color: 'var(--muted-fg)' }}>
                {p.category?.name_en ?? '—'}
              </td>
              <td style={{ padding: '8px 12px', color: 'var(--muted-fg)', fontSize: 11, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.tags?.join(', ') || '—'}
              </td>
              <td style={{ padding: '8px 12px' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {p.new && (
                    <span style={{ padding: '1px 5px', background: '#c8a96e', color: '#fff', fontSize: 9, borderRadius: 2, fontWeight: 700, textTransform: 'uppercase' }}>
                      NEW
                    </span>
                  )}
                  {p.bestSeller && (
                    <span style={{ padding: '1px 5px', background: '#1a1a1a', color: '#fff', fontSize: 9, borderRadius: 2, fontWeight: 700, textTransform: 'uppercase' }}>
                      BS
                    </span>
                  )}
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
```

- [ ] **Step 3: TypeScript compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors in `FilterBar.tsx` or `ProductTable.tsx`

- [ ] **Step 4: Commit**

```bash
git add sanity/plugins/bulkEditor/FilterBar.tsx sanity/plugins/bulkEditor/ProductTable.tsx
git commit -m "feat(bulk-editor): FilterBar + ProductTable components"
```

---

### Task 4: BulkActionPanel Component

**Files:**
- Create: `sanity/plugins/bulkEditor/BulkActionPanel.tsx`

**Interfaces:**
- Consumes: `BulkOps` from `'./types'`
- Produces: `BulkActionPanel` — props `{ selectedCount: number, loading: boolean, onApply: (ops: BulkOps) => void }`

- [ ] **Step 1: Create `BulkActionPanel.tsx`**

```tsx
// sanity/plugins/bulkEditor/BulkActionPanel.tsx
import React, { useState } from 'react'
import type { BulkOps } from './types'

type TriState = true | false | null

interface TriStateToggleProps {
  value: TriState
  onChange: (v: TriState) => void
  label: string
}

function TriStateToggle({ value, onChange, label }: TriStateToggleProps) {
  const opts: { label: string; val: TriState }[] = [
    { label: 'ON', val: true },
    { label: 'OFF', val: false },
    { label: '—', val: null },
  ]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 12, color: 'var(--muted-fg)', minWidth: 70 }}>{label}</span>
      {opts.map(opt => (
        <button
          key={String(opt.val)}
          type="button"
          onClick={() => onChange(opt.val)}
          style={{
            padding: '3px 9px',
            fontSize: 11,
            fontWeight: 600,
            border: '1px solid var(--card-border-color)',
            borderRadius: 3,
            cursor: 'pointer',
            background: value === opt.val ? '#4a7cf7' : 'transparent',
            color: value === opt.val ? '#fff' : 'var(--card-fg)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: 12,
  border: '1px solid var(--card-border-color)',
  borderRadius: 3,
  background: 'var(--card-bg)',
  color: 'var(--card-fg)',
}

const sectionStyle: React.CSSProperties = {
  border: '1px solid var(--card-border-color)',
  borderRadius: 5,
  padding: '10px 12px',
  marginBottom: 8,
}

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--muted-fg)',
  marginBottom: 8,
  display: 'block',
}

interface BulkActionPanelProps {
  selectedCount: number
  loading: boolean
  onApply: (ops: BulkOps) => void
}

export function BulkActionPanel({ selectedCount, loading, onApply }: BulkActionPanelProps) {
  const [priceMode, setPriceMode] = useState<'pct' | 'flat'>('pct')
  const [priceValue, setPriceValue] = useState('')
  const [compareAtMarkup, setCompareAtMarkup] = useState('')
  const [clearSale, setClearSale] = useState(false)

  const [flagNew, setFlagNew] = useState<TriState>(null)
  const [flagBS, setFlagBS] = useState<TriState>(null)
  const [flagInStock, setFlagInStock] = useState<TriState>(null)
  const [status, setStatus] = useState('')

  const [addTagsInput, setAddTagsInput] = useState('')
  const [removeTagsInput, setRemoveTagsInput] = useState('')

  const [badgeTextEn, setBadgeTextEn] = useState('')
  const [badgeTextAr, setBadgeTextAr] = useState('')
  const [badgeColor, setBadgeColor] = useState('')

  const hasOps =
    priceValue !== '' ||
    compareAtMarkup !== '' ||
    clearSale ||
    flagNew !== null ||
    flagBS !== null ||
    flagInStock !== null ||
    status !== '' ||
    addTagsInput.trim() !== '' ||
    removeTagsInput.trim() !== '' ||
    badgeTextEn !== '' ||
    badgeTextAr !== '' ||
    badgeColor !== ''

  function handleApply() {
    const ops: BulkOps = {}

    if (priceValue !== '') {
      ops.priceMode = priceMode
      ops.priceValue = parseFloat(priceValue)
    }
    if (compareAtMarkup !== '') ops.compareAtMarkupPct = parseFloat(compareAtMarkup)
    if (clearSale) ops.clearSale = true

    if (flagNew !== null) ops.new = flagNew
    if (flagBS !== null) ops.bestSeller = flagBS
    if (flagInStock !== null) ops.inStock = flagInStock
    if (status) ops.status = status as 'active' | 'draft' | 'archived'

    const addTags = addTagsInput.split(',').map(t => t.trim()).filter(Boolean)
    const removeTags = removeTagsInput.split(',').map(t => t.trim()).filter(Boolean)
    if (addTags.length > 0) ops.addTags = addTags
    if (removeTags.length > 0) ops.removeTags = removeTags

    if (badgeTextEn) ops.badgeText_en = badgeTextEn
    if (badgeTextAr) ops.badgeText_ar = badgeTextAr
    if (badgeColor) ops.badgeColor = badgeColor

    onApply(ops)
  }

  return (
    <div style={{ borderTop: '2px solid var(--card-border-color)', background: 'var(--card-bg)', padding: 16, maxHeight: 380, overflowY: 'auto' }}>
      <p style={{ margin: '0 0 12px', fontSize: 13, fontWeight: 600 }}>
        Bulk Actions — {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
      </p>

      {/* ── Price ── */}
      <div style={sectionStyle}>
        <span style={sectionLabelStyle}>Price</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
          <select
            value={priceMode}
            onChange={e => setPriceMode(e.target.value as 'pct' | 'flat')}
            style={inputStyle}
          >
            <option value="pct">%</option>
            <option value="flat">Flat $</option>
          </select>
          <input
            type="number"
            placeholder={priceMode === 'pct' ? '+10 or -10' : '+5.00 or -5.00'}
            value={priceValue}
            onChange={e => setPriceValue(e.target.value)}
            style={{ ...inputStyle, width: 130 }}
          />
          <span style={{ fontSize: 11, color: 'var(--muted-fg)' }}>
            Applies to base price + all volume prices
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-fg)' }}>compareAt markup %:</span>
            <input
              type="number"
              placeholder="e.g. 20"
              value={compareAtMarkup}
              onChange={e => setCompareAtMarkup(e.target.value)}
              style={{ ...inputStyle, width: 80 }}
            />
          </div>
          <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={clearSale}
              onChange={e => setClearSale(e.target.checked)}
            />
            Clear sale (remove compareAtPrice)
          </label>
        </div>
      </div>

      {/* ── Flags ── */}
      <div style={sectionStyle}>
        <span style={sectionLabelStyle}>Flags</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <TriStateToggle value={flagNew} onChange={setFlagNew} label="New" />
          <TriStateToggle value={flagBS} onChange={setFlagBS} label="Best Seller" />
          <TriStateToggle value={flagInStock} onChange={setFlagInStock} label="In Stock" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--muted-fg)', minWidth: 70 }}>Status</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="">— skip —</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Tags ── */}
      <div style={sectionStyle}>
        <span style={sectionLabelStyle}>Tags</span>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <span style={{ fontSize: 11, color: 'var(--muted-fg)', display: 'block', marginBottom: 4 }}>
              Add (comma-separated)
            </span>
            <input
              type="text"
              placeholder="oud, floral, unisex"
              value={addTagsInput}
              onChange={e => setAddTagsInput(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <span style={{ fontSize: 11, color: 'var(--muted-fg)', display: 'block', marginBottom: 4 }}>
              Remove (comma-separated)
            </span>
            <input
              type="text"
              placeholder="sale, limited"
              value={removeTagsInput}
              onChange={e => setRemoveTagsInput(e.target.value)}
              style={{ ...inputStyle, width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* ── Badge ── */}
      <div style={sectionStyle}>
        <span style={sectionLabelStyle}>Badge</span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Badge text EN"
            value={badgeTextEn}
            onChange={e => setBadgeTextEn(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 140 }}
          />
          <input
            type="text"
            placeholder="Badge text AR"
            value={badgeTextAr}
            onChange={e => setBadgeTextAr(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 140 }}
          />
          <select
            value={badgeColor}
            onChange={e => setBadgeColor(e.target.value)}
            style={inputStyle}
          >
            <option value="">— color skip —</option>
            <option value="gold">Gold</option>
            <option value="black">Black</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="pink">Pink</option>
          </select>
        </div>
      </div>

      {/* ── Apply ── */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
        <button
          type="button"
          onClick={handleApply}
          disabled={!hasOps || selectedCount === 0 || loading}
          style={{
            padding: '10px 28px',
            fontSize: 13,
            fontWeight: 600,
            background: hasOps && selectedCount > 0 && !loading ? '#c8a96e' : '#888',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: hasOps && selectedCount > 0 && !loading ? 'pointer' : 'not-allowed',
            transition: 'background 0.15s',
          }}
        >
          {loading ? 'Applying…' : `Apply to ${selectedCount} product${selectedCount !== 1 ? 's' : ''} →`}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: TypeScript compile check**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors in `BulkActionPanel.tsx`

- [ ] **Step 3: Commit**

```bash
git add sanity/plugins/bulkEditor/BulkActionPanel.tsx
git commit -m "feat(bulk-editor): BulkActionPanel — all 8 operation sections"
```

---

### Task 5: BulkEditorTool + Plugin Registration

**Files:**
- Create: `sanity/plugins/bulkEditor/BulkEditorTool.tsx`
- Create: `sanity/plugins/bulkEditor/index.tsx`
- Modify: `sanity.config.ts`

**Interfaces:**
- Consumes: all hooks + components from previous tasks
- Produces: `bulkEditorPlugin` — imported and used in `sanity.config.ts`

- [ ] **Step 1: Create `BulkEditorTool.tsx`**

```tsx
// sanity/plugins/bulkEditor/BulkEditorTool.tsx
import React, { useState, useMemo, useCallback } from 'react'
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
    setTimeout(() => setToast(null), 4000)
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
```

- [ ] **Step 2: Create `index.tsx`**

```tsx
// sanity/plugins/bulkEditor/index.tsx
import { definePlugin } from 'sanity'
import { LayersIcon } from '@sanity/icons'
import { BulkEditorTool } from './BulkEditorTool'

export const bulkEditorPlugin = definePlugin({
  name: 'bulk-editor',
  tools: [
    {
      name: 'bulk-editor',
      title: 'Bulk Editor',
      icon: LayersIcon,
      component: BulkEditorTool,
    },
  ],
})
```

- [ ] **Step 3: Register in `sanity.config.ts`**

Add `bulkEditorPlugin` to the imports and plugins array. The final file should look like:

```ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { presentationTool } from 'sanity/presentation'
import { assist } from '@sanity/assist'
import { colorInput } from '@sanity/color-input'
import { schemaTypes } from './sanity/schemaTypes'
import { StudioLogo } from './sanity/components/StudioLogo'
import { StudioLayout } from './sanity/components/StudioLayout'
import { translateToArabicAction } from './sanity/actions/translateToArabic'
import { aiFillAction } from './sanity/actions/aiFill'
import { bulkEditorPlugin } from './sanity/plugins/bulkEditor'

export default defineConfig({
  name: 'default',
  title: 'Luxe Parfum',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    colorInput(),
    assist(),
    presentationTool({
      previewUrl: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        draftMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    bulkEditorPlugin(),
  ],
  schema: { types: schemaTypes },
  document: {
    actions: (prev) => [...prev, translateToArabicAction, aiFillAction],
  },
  studio: {
    components: {
      logo: StudioLogo,
      layout: StudioLayout,
    },
  },
})
```

- [ ] **Step 4: TypeScript compile check**

```bash
npx tsc --noEmit 2>&1 | head -40
```

Expected: zero errors across all 8 plugin files and `sanity.config.ts`

- [ ] **Step 5: Start Studio and verify**

```bash
npx sanity dev
```

Open `http://localhost:3333/studio`. Expected:
1. A **"Bulk Editor"** item appears in the Studio sidebar with a layers icon
2. Clicking it loads the table with all products
3. Search, category, status, tag filters narrow the list
4. Checking products shows the Bulk Action panel at the bottom
5. Configuring an operation and clicking Apply shows the success toast
6. Table refreshes with updated data after apply

- [ ] **Step 6: Commit**

```bash
git add sanity/plugins/bulkEditor/BulkEditorTool.tsx sanity/plugins/bulkEditor/index.tsx sanity.config.ts
git commit -m "feat(bulk-editor): root tool component + plugin registration"
```
