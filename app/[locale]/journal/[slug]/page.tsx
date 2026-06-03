import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { getArticleBySlug, getArticles } from '@/lib/sanity/fetch'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 300

export async function generateStaticParams() {
  try {
    const articles = await getArticles()
    return articles.map(a => ({ slug: a.slug }))
  } catch { return [] }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}): Promise<Metadata> {
  const { slug, locale } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found' }
  const isAr = locale === 'ar'
  const title = (isAr ? article.seoTitle_ar : article.seoTitle_en) || (isAr ? article.title_ar : article.title_en)
  return {
    title,
    description: isAr ? article.seoDescription_ar : article.seoDescription_en,
    openGraph: {
      title: title ?? undefined,
      ...(article.coverImageUrl ? { images: [{ url: article.coverImageUrl }] } : {}),
    },
  }
}

const ptComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="mb-5 font-body text-base font-light leading-relaxed text-charcoal-700">{children}</p>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="mt-10 mb-4 font-display text-2xl font-light text-charcoal-900">{children}</h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mt-8 mb-3 font-display text-xl font-light text-charcoal-900">{children}</h3>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="my-8 border-l-2 border-gold-400 pl-6 font-display text-lg font-light italic text-charcoal-600">{children}</blockquote>
    ),
  },
  types: {
    image: ({ value }: { value: { asset?: { url?: string }; alt?: string; caption?: string } }) => (
      <figure className="my-10">
        {value.asset?.url && (
          <Image src={value.asset.url} alt={value.alt || ''} width={800} height={500} className="w-full object-cover" />
        )}
        {value.caption && (
          <figcaption className="mt-2 text-center font-body text-xs text-charcoal-400">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const isAr = locale === 'ar'
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const title = isAr ? (article.title_ar || article.title_en) : article.title_en
  const excerpt = isAr ? (article.excerpt_ar || article.excerpt_en) : article.excerpt_en
  const body = isAr ? (article.body_ar || article.body_en) : article.body_en

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Cover */}
      {article.coverImageUrl && (
        <div className="relative h-[60vh] overflow-hidden bg-charcoal-900">
          <Image src={article.coverImageUrl} alt={article.coverImageAlt || title} fill className="object-cover opacity-70" priority />
        </div>
      )}

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        {/* Back */}
        <Link href={`/${locale}/journal`} className="mb-8 inline-flex items-center gap-2 font-body text-xs text-charcoal-400 hover:text-gold-500 transition-colors">
          <ArrowLeft size={13} /> Back to Journal
        </Link>

        {/* Meta */}
        <div className="mb-6 flex items-center gap-4">
          {article.category && (
            <span className="font-body text-[9px] font-semibold uppercase tracking-[0.3em] text-gold-500">{article.category}</span>
          )}
          {article.readTime && <span className="font-body text-[9px] text-charcoal-400">{article.readTime}</span>}
          {article.publishedAt && (
            <span className="font-body text-[9px] text-charcoal-400">
              {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
        </div>

        <h1 className="mb-5 font-display text-4xl font-light leading-tight text-charcoal-900 md:text-5xl">{title}</h1>
        {excerpt && <p className="mb-10 border-b border-charcoal-100 pb-10 font-body text-base font-light leading-relaxed text-charcoal-500">{excerpt}</p>}

        {/* Body */}
        {body && body.length > 0 && (
          <div className="prose-none">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <PortableText value={body} components={ptComponents as any} />
          </div>
        )}
      </div>
    </div>
  )
}
