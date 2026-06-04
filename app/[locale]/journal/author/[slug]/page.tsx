import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAuthorBySlug, getAuthors } from '@/lib/sanity/fetch'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const authors = await getAuthors()
    return authors.map((a) => ({ slug: a.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: 'Author Not Found' }
  const isAr = locale === 'ar'
  const name = isAr ? (author.name_ar || author.name_en) : author.name_en
  const role = isAr ? (author.role_ar || author.role_en) : author.role_en
  return {
    title: `${name}${role ? ` — ${role}` : ''} | Luxe Parfum Journal`,
    description: isAr ? (author.bio_ar || author.bio_en) : author.bio_en,
    ...(author.photoUrl ? { openGraph: { images: [{ url: author.photoUrl }] } } : {}),
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const isAr = locale === 'ar'
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const name = isAr ? (author.name_ar || author.name_en) : author.name_en
  const role = isAr ? (author.role_ar || author.role_en) : author.role_en
  const bio = isAr ? (author.bio_ar || author.bio_en) : author.bio_en
  const articles = author.articles ?? []

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}/journal`}
          className="mb-10 inline-flex items-center gap-2 font-body text-xs text-charcoal-400 hover:text-gold-500 transition-colors"
        >
          <ArrowLeft size={13} /> Back to Journal
        </Link>

        {/* Author hero */}
        <div className="mb-16 flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start gap-8">
          {author.photoUrl ? (
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-gold-200">
              <Image
                src={author.photoUrl}
                alt={name}
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-charcoal-100 border-2 border-gold-200">
              <span className="font-display text-4xl font-light text-gold-500">{name.charAt(0)}</span>
            </div>
          )}
          <div>
            {role && (
              <p className="mb-1 font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
                {role}
              </p>
            )}
            <h1 className="font-display text-3xl font-light text-charcoal-900 md:text-4xl">{name}</h1>
            {bio && (
              <p className="mt-4 max-w-xl font-body text-sm font-light leading-relaxed text-charcoal-500">
                {bio}
              </p>
            )}
          </div>
        </div>

        <div className="mb-12 h-px w-full bg-charcoal-100" />

        <div className="mb-8">
          <p className="font-body text-[9px] font-semibold uppercase tracking-[0.4em] text-gold-500">
            Articles by {name}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-body text-sm text-charcoal-400">No articles published yet.</p>
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
                      {article.category && (
                        <span className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500">
                          {article.category}
                        </span>
                      )}
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
