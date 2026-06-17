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
