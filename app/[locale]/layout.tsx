import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/layout/Providers'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import VisualEditingWrapper from '@/components/VisualEditingWrapper'
import { getAllCategories, getNavPages, getNavConfig, getAnnouncementBar, getMenuPromo } from '@/lib/sanity/fetch'
import AnnouncementBar from '@/components/layout/AnnouncementBar'

const locales = ['en', 'ar']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale)) notFound()

  const messages = await getMessages()
  const [categories, navPages, navItems, announcementBar, menuPromo] = await Promise.all([
    getAllCategories(),
    getNavPages(),
    getNavConfig(),
    getAnnouncementBar(),
    getMenuPromo(),
  ])

  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        {announcementBar && <AnnouncementBar data={announcementBar} />}
        <ConditionalLayout
          key="layout"
          header={<Header categories={categories} navPages={navPages} navItems={navItems} menuPromo={menuPromo} />}
          footer={<Footer />}
        >
          {children}
        </ConditionalLayout>
        {isDraftMode && <VisualEditingWrapper key="visual-editing" />}
      </Providers>
    </NextIntlClientProvider>
  )
}
