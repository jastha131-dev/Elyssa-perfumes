import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'The story behind Luxe Parfum — our philosophy, our craft, and our commitment to the art of fragrance.',
}

const PILLARS = [
  {
    number: '01',
    title: 'Uncompromising Craft',
    body: 'Every fragrance in our collection is composed by master perfumers with decades of experience. We never rush the creative process — a single scent may take years to perfect.',
  },
  {
    number: '02',
    title: 'Rare Ingredients',
    body: 'We source from the world\'s finest growing regions — Bulgarian rose, Madagascan vanilla, Omani frankincense. Rarity is not a luxury; it is a necessity.',
  },
  {
    number: '03',
    title: 'Lasting Impression',
    body: 'Longevity and sillage are non-negotiable. Our formulations use the highest concentration of pure fragrance oil, designed to accompany you from morning through evening.',
  },
]

const TIMELINE = [
  { year: '2010', event: 'Founded in Paris with a single ambition: to make luxury fragrance accessible without compromise.' },
  { year: '2014', event: 'First collection launched — twelve scents inspired by twelve cities. Sold out in six weeks.' },
  { year: '2018', event: 'Opened our first atelier, where visitors can experience raw materials and commission bespoke creations.' },
  { year: '2023', event: 'Expanded globally, now shipping to over 60 countries. The pursuit of excellence continues.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-charcoal-950 pb-24 pt-40">
        {/* Subtle gold gradient orb */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.45em] text-gold-500">
            Our Story
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-light leading-tight text-cream-100 md:text-7xl">
            The Art of<br />
            <em className="font-light italic text-gold-400">Fragrance</em>
          </h1>
          <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-cream-300">
            Luxe Parfum was born from a singular obsession: that scent is the most intimate form of self-expression, and it deserves to be treated as fine art.
          </p>

          {/* Decorative line */}
          <div className="mt-16 flex items-center gap-6">
            <div className="h-px w-16 bg-gold-500" />
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold-500/60">Est. 2010 · Paris</span>
          </div>
        </div>
      </section>

      {/* ── Brand story ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500/70">
              Philosophy
            </p>
            <h2 className="mb-6 font-display text-3xl font-light text-charcoal-900 md:text-4xl">
              Scent is memory.<br />Scent is identity.
            </h2>
            <div className="space-y-5 text-sm font-light leading-relaxed text-charcoal-600">
              <p>
                We believe a great fragrance does more than smell beautiful. It becomes part of who you are — triggering memories, shaping moods, announcing your presence before a word is spoken.
              </p>
              <p>
                That belief drives every decision we make, from the raw materials we choose to the bottles we design. Nothing at Luxe Parfum is accidental. Everything is intentional.
              </p>
              <p>
                We work with a small circle of independent perfumers — people who treat fragrance as a lifelong discipline rather than a commercial exercise. The results speak for themselves.
              </p>
            </div>
          </div>

          {/* Stats column */}
          <div className="flex flex-col justify-center gap-8 border-l border-charcoal-100 pl-16">
            {[
              { value: '60+', label: 'Countries we ship to' },
              { value: '14', label: 'Years of craft' },
              { value: '100%', label: 'Pure fragrance oil' },
              { value: '48h', label: 'Worldwide express delivery' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-4xl font-light text-charcoal-900">{value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-charcoal-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Three pillars ────────────────────────────────────────────── */}
      <section className="border-y border-charcoal-100 bg-charcoal-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid divide-y divide-white/8 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {PILLARS.map((pillar) => (
              <div key={pillar.number} className="px-8 py-16 lg:px-10">
                <p className="mb-6 font-display text-5xl font-light text-gold-500/30">
                  {pillar.number}
                </p>
                <h3 className="mb-4 font-display text-xl font-medium text-cream-100">
                  {pillar.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-cream-300/80">
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500/70">
          Milestones
        </p>
        <h2 className="mb-16 font-display text-3xl font-light text-charcoal-900 md:text-4xl">
          How we got here
        </h2>

        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-[72px] top-0 h-full w-px bg-charcoal-100 lg:left-[88px]" />

          {TIMELINE.map(({ year, event }) => (
            <div key={year} className="relative flex gap-10 pb-12 lg:gap-14">
              <div className="relative z-10 w-16 shrink-0 lg:w-20">
                <span className="inline-flex h-8 items-center bg-cream-50 pr-3 font-display text-sm font-medium text-gold-600">
                  {year}
                </span>
              </div>
              <p className="pt-1 text-sm font-light leading-relaxed text-charcoal-600">
                {event}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Promise / CTA ────────────────────────────────────────────── */}
      <section className="bg-charcoal-900 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="h-px w-12 bg-gold-500" />
          </div>
          <h2 className="mb-6 font-display text-3xl font-light text-cream-100 md:text-4xl">
            Our Promise to You
          </h2>
          <p className="mb-10 text-sm font-light leading-relaxed text-cream-300">
            Every order ships with complimentary samples. Every fragrance carries a 30-day satisfaction guarantee. If it does not move you, we will make it right — no questions asked.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/products"
              className="inline-block bg-gold-500 px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-charcoal-950 transition-colors duration-300 hover:bg-gold-400"
            >
              Explore Collection
            </Link>
            <Link
              href="/journal"
              className="inline-block border border-white/20 px-10 py-3.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-cream-200 transition-colors duration-300 hover:border-gold-500/50 hover:text-gold-400"
            >
              Read the Journal
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
