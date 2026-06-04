// app/[locale]/admin/_components/DiscountSummary.tsx
'use client'

interface Props {
  totalDiscountGiven: number
  ordersWithDiscount: number
  orderCount: number
}

export function DiscountSummary({ totalDiscountGiven, ordersWithDiscount, orderCount }: Props) {
  const pct = orderCount > 0 ? ((ordersWithDiscount / orderCount) * 100).toFixed(1) : '0'

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
        Discount Performance
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Total Saved by Customers', value: `$${totalDiscountGiven.toFixed(2)}` },
          { label: 'Orders with Discount', value: ordersWithDiscount.toString() },
          { label: 'Discount Usage Rate', value: `${pct}%` },
        ].map(({ label, value }) => (
          <div key={label}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 26, fontWeight: 300, color: '#fff' }}>{value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
