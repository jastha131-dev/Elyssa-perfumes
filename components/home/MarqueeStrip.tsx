import { useLocale } from 'next-intl'
import type { MarqueeSectionBlock } from '@/lib/types'

const Diamond = () => (
  <span className="mx-8 inline-block h-1 w-1 rotate-45 bg-camel-500 align-middle" />
)

const Strip = ({ items }: { items: string[] }) => (
  <>
    {items.map((text, i) => (
      <span key={i} className="inline-flex items-center">
        <span className="font-body text-[10px] font-light uppercase tracking-[0.45em] text-ink-700">
          {text}
        </span>
        <Diamond />
      </span>
    ))}
  </>
)

interface MarqueeStripProps {
  data?: MarqueeSectionBlock
}

export default function MarqueeStrip({ data }: MarqueeStripProps = {}) {
  const locale = useLocale()
  const isAr = locale === 'ar'

  const raw = (isAr ? data?.text_ar : data?.text_en) ?? ''
  if (!raw) return null

  const items = raw.split('•').map((s) => s.trim()).filter(Boolean)

  return (
    <div className="overflow-hidden border-y border-stone-200 bg-stone-200">
      {/* Row 1 — left to right */}
      <div className="border-b border-stone-200/60 py-4">
        <div className="flex animate-marquee whitespace-nowrap [will-change:transform]">
          <Strip items={items} />
          <Strip items={items} />
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="py-4">
        <div className="flex animate-marquee-reverse whitespace-nowrap [will-change:transform]">
          <Strip items={items} />
          <Strip items={items} />
        </div>
      </div>
    </div>
  )
}
