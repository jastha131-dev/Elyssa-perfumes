// app/[locale]/admin/_components/KPICard.tsx
interface KPICardProps {
  label: string
  value: string
  sub?: string
  trend?: 'up' | 'down' | 'flat'
  trendLabel?: string
}

export function KPICard({ label, value, sub, trend, trendLabel }: KPICardProps) {
  const trendColor = trend === 'up' ? '#4ade80' : trend === 'down' ? '#f87171' : 'rgba(255,255,255,0.25)'
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      padding: 24,
    }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {value}
      </p>
      {sub && <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>{sub}</p>}
      {trend && trendLabel && (
        <p style={{ fontSize: 11, color: trendColor, marginTop: 8 }}>
          {trendArrow} {trendLabel}
        </p>
      )}
    </div>
  )
}
