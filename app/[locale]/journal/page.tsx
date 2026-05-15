import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Journal',
  description: 'Stories, guides, and the art of fragrance from Luxe Parfum.',
}

const PLACEHOLDER_ARTICLES = [
  {
    slug: 'art-of-layering-fragrances',
    category: 'Guide',
    title: 'The Art of Layering Fragrances',
    excerpt: 'Discover how combining two or more scents creates a signature that is uniquely yours.',
    readTime: '5 min read',
    date: 'May 2025',
  },
  {
    slug: 'understanding-fragrance-families',
    category: 'Education',
    title: 'Understanding Fragrance Families',
    excerpt: 'From fresh citrus to deep orientals — a guide to the olfactory wheel and what each family evokes.',
    readTime: '7 min read',
    date: 'April 2025',
  },
  {
    slug: 'how-to-store-your-perfume',
    category: 'Care',
    title: 'How to Store Your Perfume',
    excerpt: "Light, heat, and humidity are fragrance's enemies. Learn how to preserve your collection.",
    readTime: '4 min read',
    date: 'March 2025',
  },
  {
    slug: 'seasonal-scent-guide',
    category: 'Guide',
    title: 'A Seasonal Scent Guide',
    excerpt: 'The right fragrance shifts with the season. Our editors pick the finest scents for every time of year.',
    readTime: '6 min read',
    date: 'February 2025',
  },
  {
    slug: 'notes-explained',
    category: 'Education',
    title: 'Top, Heart & Base Notes Explained',
    excerpt: 'Why does a fragrance smell different an hour after application? The answer lies in its structure.',
    readTime: '5 min read',
    date: 'January 2025',
  },
  {
    slug: 'gifting-fragrance',
    category: 'Gifting',
    title: 'The Thoughtful Guide to Gifting Fragrance',
    excerpt: 'Perfume is intimate. These tips help you choose a scent that will genuinely move the recipient.',
    readTime: '4 min read',
    date: 'December 2024',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  Guide: 'text-gold-500',
  Education: 'text-cream-400',
  Care: 'text-cream-400',
  Gifting: 'text-gold-500',
}

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <section className="border-b border-charcoal-100 bg-charcoal-950 pb-16 pt-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-gold-500">
            Luxe Parfum
          </p>
          <h1 className="font-display text-5xl font-light text-cream-50 md:text-6xl">
            The Journal
          </h1>
          <p className="mt-4 max-w-lg text-base font-light leading-relaxed text-cream-300">
            Stories, education, and the art of fragrance — written for those who take scent seriously.
          </p>
        </div>
      </section>

      {/* Articles grid */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-px border border-charcoal-100 bg-charcoal-100 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="group bg-cream-50 p-8 transition-colors duration-300 hover:bg-white"
            >
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <span className={`text-[9px] font-semibold uppercase tracking-[0.35em] ${CATEGORY_COLORS[article.category] ?? 'text-charcoal-400'}`}>
                    {article.category}
                  </span>
                  <span className="text-[10px] text-charcoal-400">{article.date}</span>
                </div>

                <h2 className="mb-3 font-display text-xl font-medium leading-snug text-charcoal-900 transition-colors group-hover:text-charcoal-800">
                  {article.title}
                </h2>

                <p className="mb-6 flex-1 text-sm font-light leading-relaxed text-charcoal-500">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-charcoal-400">{article.readTime}</span>
                  <span className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-widest text-charcoal-900 transition-all duration-200 group-hover:gap-2 group-hover:text-gold-600">
                    Read
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coming soon note */}
        <p className="mt-12 text-center text-sm font-light text-charcoal-400">
          Full articles coming soon.{' '}
          <Link href="/products" className="text-gold-600 underline underline-offset-2 hover:text-gold-500 transition-colors">
            Explore the collection
          </Link>{' '}
          in the meantime.
        </p>
      </section>
    </div>
  )
}
