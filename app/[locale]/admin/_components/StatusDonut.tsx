// app/[locale]/admin/_components/StatusDonut.tsx
'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { StatusCount } from '@/lib/sanity/admin-fetch'

export function StatusDonut({ data }: { data: StatusCount[] }) {
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24 }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
        Orders by Status
      </p>
      <p style={{ fontSize: 26, fontWeight: 300, color: '#fff', marginBottom: 16 }}>{total} total</p>
      {data.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12, padding: '32px 0' }}>No orders yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              itemStyle={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}
            />
            <Legend formatter={(v) => <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
