import type { MarqueeSectionBlock } from '@/lib/types'

const ITEMS_A = [
  'Luxury Fragrance',
  'Handcrafted Excellence',
  'Rare Ingredients',
  'The Art of Perfumery',
  'Since 2024',
  'Crafted With Passion',
]

const ITEMS_B = [
  'Inspired by Nature',
  'Worn by Few',
  'Maison de Parfum',
  'Olfactory Narratives',
  'Master Perfumers',
  'Aged to Perfection',
]

const Diamond = () => (
  <span className="mx-8 inline-block h-1 w-1 rotate-45 bg-gold-500 align-middle" />
)

const Strip = ({ items }: { items: string[] }) => (
  <>
    {items.map((text, i) => (
      <span key={i} className="inline-flex items-center">
        <span className="font-body text-[10px] font-light uppercase tracking-[0.45em] text-charcoal-500">
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
  const _text = data?.text
  const _speed = data?.speed

  return (
    <div className="overflow-hidden border-y border-charcoal-200 bg-cream-50">
      {/* Row 1 — left to right */}
      <div className="border-b border-charcoal-200/60 py-4">
        <div className="flex animate-marquee whitespace-nowrap [will-change:transform]">
          <Strip items={ITEMS_A} />
          <Strip items={ITEMS_A} />
        </div>
      </div>

      {/* Row 2 — right to left */}
      <div className="py-4">
        <div className="flex animate-marquee-reverse whitespace-nowrap [will-change:transform]">
          <Strip items={ITEMS_B} />
          <Strip items={ITEMS_B} />
        </div>
      </div>
    </div>
  )
}
