// app/[locale]/admin/_components/InventoryTable.tsx
'use client'

import type { AdminProduct } from '@/lib/sanity/admin-fetch'

function StockBadge({ stock }: { stock: number }) {
  const color = stock === 0 ? '#f87171' : stock <= 5 ? '#fca5a5' : '#fcd34d'
  const bg = stock === 0 ? 'rgba(239,68,68,0.15)' : stock <= 5 ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.1)'
  const label = stock === 0 ? 'Out of Stock' : `${stock} left`
  return (
    <span style={{ background: bg, color, borderRadius: 999, padding: '2px 10px', fontSize: 10, fontWeight: 600 }}>
      {label}
    </span>
  )
}

export function InventoryTable({ products }: { products: AdminProduct[] }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
        Low Stock Alert (≤ 10 units)
      </p>
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#4ade80', fontSize: 12, padding: '24px 0' }}>All products well stocked ✓</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {products.map((p) => (
            <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: '12px 16px' }}>
              <div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{p.name_en}</p>
                {p.category && <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{p.category}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>${p.price}</span>
                <StockBadge stock={p.stock} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
