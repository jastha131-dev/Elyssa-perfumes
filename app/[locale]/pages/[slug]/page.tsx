import { notFound } from 'next/navigation'
import { getPageBySlug } from '@/lib/sanity/fetch'
import PageBuilder from '@/components/PageBuilder'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug, locale } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return {
    title: locale === 'ar' ? (page.title_ar || page.title_en) : page.title_en,
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()
  return <PageBuilder sections={page.sections} />
}
