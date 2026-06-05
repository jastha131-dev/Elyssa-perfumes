import { getPageBySlug } from '@/lib/sanity/fetch'
import PageBuilder from '@/components/PageBuilder'
import CorporateForm from '@/components/CorporateForm'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const page = await getPageBySlug('corporate-gifting')
  if (!page) return { title: locale === 'ar' ? 'الهدايا للشركات' : 'Corporate Gifting' }
  return { title: locale === 'ar' ? (page.title_ar || page.title_en) : page.title_en }
}

export default async function CorporateGiftingPage() {
  const page = await getPageBySlug('corporate-gifting')
  return (
    <>
      {page?.sections && <PageBuilder sections={page.sections} />}
      <CorporateForm />
    </>
  )
}
