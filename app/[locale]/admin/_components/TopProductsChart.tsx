// app/[locale]/admin/_components/TopProductsChart.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TopProduct } from '@/lib/sanity/admin-fetch'

function truncate(s: string, n: number): string {
  return s.length > n ? s.slice(0, n) + '…' : s
}

export function TopProductsChart({ data }: { data: TopProduct[] }) {
  const chartData = data.map((d) => ({ ...d, shortName: truncate(d.name, 22) }))

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 24 }}>
        Top Products — Last 30 Days
      </p>
      {data.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, padding: '32px 0' }}>No orders in last 30 days</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tickFormatter={(v) => `$${v}`} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="shortName" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickLine={false} axisLine={false} width={140} />
            <Tooltip
              contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              itemStyle={{ color: '#d99a1b', fontSize: 11 }}
              formatter={(v: unknown) => [`$${Number(v).toFixed(2)}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#d99a1b" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
