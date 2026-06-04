import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getArticlesByCategory } from '@/lib/sanity/fetch'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 300

const CATEGORY_MAP: Record<string, string> = {
  guide: 'Guide',
  education: 'Education',
  'behind-the-scenes': 'Behind the Scenes',
  inspiration: 'Inspiration',
  news: 'News',
}

export async function generateStaticParams() {
  return Object.keys(CATEGORY_MAP).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const category = CATEGORY_MAP[slug]
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${category} — Journal | Luxe Parfum`,
    description: `Browse all ${category} articles from Luxe Parfum.`,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const isAr = locale === 'ar'
  const category = CATEGORY_MAP[slug]
  if (!category) notFound()

  const articles = await getArticlesByCategory(category)

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/journal`}
          className="mb-10 inline-flex items-center gap-2 font-body text-xs text-charcoal-400 hover:text-gold-500 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Journal
        </Link>

        <div className="mb-16 text-center">
          <p className="mb-3 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
            Journal
          </p>
          <h1 className="font-display text-4xl font-light text-charcoal-900 md:text-6xl">
            {category}
          </h1>
          <div className="mx-auto mt-4 h-px w-12 bg-gold-400/50" />
        </div>

        {articles.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-body text-sm text-charcoal-400">
              No articles in this category yet.
            </p>
            <Link
              href={`/${locale}/journal`}
              className="mt-4 inline-block font-body text-xs text-gold-500 underline-offset-2 hover:underline"
            >
              Browse all articles
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => {
              const title = isAr ? (article.title_ar || article.title_en) : article.title_en
              const excerpt = isAr
                ? (article.excerpt_ar || article.excerpt_en)
                : article.excerpt_en
              return (
                <Link
                  key={article._id}
                  href={`/${locale}/journal/${article.slug}`}
                  className="group block"
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
                        <span className="font-display text-4xl font-light text-gold-500/30">
                          {title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500">
                        {article.category}
                      </span>
                      {article.readTime && (
                        <span className="font-body text-[9px] text-charcoal-400">
                          {article.readTime}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-lg font-light text-charcoal-900 transition-colors group-hover:text-gold-600 leading-snug">
                      {title}
                    </h2>
                    {excerpt && (
                      <p className="mt-2 font-body text-sm font-light leading-relaxed text-charcoal-500 line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                    {article.publishedAt && (
                      <p className="mt-3 font-body text-[10px] text-charcoal-400">
                        {new Date(article.publishedAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
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
