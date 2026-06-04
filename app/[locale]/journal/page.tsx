import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getArticles } from '@/lib/sanity/fetch'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Journal — Luxe Parfum',
  description: 'Stories, guides, and the art of fragrance from Luxe Parfum.',
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isAr = locale === 'ar'
  const articles = await getArticles()

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">Luxe Parfum</p>
          <h1 className="font-display text-4xl font-light text-charcoal-900 md:text-6xl">Journal</h1>
          <div className="mx-auto mt-4 h-px w-12 bg-gold-400/50" />
        </div>

        {articles.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-body text-sm text-charcoal-400">No articles published yet.</p>
            <p className="mt-2 font-body text-xs text-charcoal-300">Add articles in Sanity Studio → Journal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => {
              const title = isAr ? (article.title_ar || article.title_en) : article.title_en
              const excerpt = isAr ? (article.excerpt_ar || article.excerpt_en) : article.excerpt_en
              const isFeatured = article.featured && i === 0
              return (
                <Link
                  key={article._id}
                  href={`/${locale}/journal/${article.slug}`}
                  className={`group block ${isFeatured ? 'md:col-span-2 lg:col-span-2' : ''}`}
                >
                  <div className="overflow-hidden bg-charcoal-100 aspect-[16/9]">
                    {article.coverImageUrl ? (
                      <Image
                        src={article.coverImageUrl}
                        alt={article.coverImageAlt || title}
                        width={800}
                        height={450}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-charcoal-800 to-charcoal-900 flex items-center justify-center">
                        <span className="font-display text-4xl font-light text-gold-500/30">{title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-3">
                      {article.category && (
                        <Link
                          href={`/${locale}/journal/category/${article.category.toLowerCase().replace(/ /g, '-')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500 hover:text-gold-600 transition-colors"
                        >
                          {article.category}
                        </Link>
                      )}
                      {article.readTime && (
                        <span className="font-body text-[9px] text-charcoal-400">{article.readTime}</span>
                      )}
                    </div>
                    <h2 className={`font-display font-light text-charcoal-900 transition-colors group-hover:text-gold-600 leading-snug ${isFeatured ? 'text-2xl' : 'text-lg'}`}>
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="mt-2 font-body text-sm font-light leading-relaxed text-charcoal-500 line-clamp-2">{excerpt}</p>
                    )}
                    {article.publishedAt && (
                      <p className="mt-3 font-body text-[10px] text-charcoal-400">
                        {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
