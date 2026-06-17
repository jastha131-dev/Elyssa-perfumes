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
