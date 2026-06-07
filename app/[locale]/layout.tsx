import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/layout/Providers'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import VisualEditingWrapper from '@/components/VisualEditingWrapper'
import { getAllCategories, getCollections, getNavPages, getNavConfig, getAnnouncementBar, getMenuPromo, getSiteLogo } from '@/lib/sanity/fetch'
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
  const [categories, collections, navPages, navItems, announcementBar, menuPromo, siteLogo] = await Promise.all([
    getAllCategories(),
    getCollections(),
    getNavPages(),
    getNavConfig(),
    getAnnouncementBar(),
    getMenuPromo(),
    getSiteLogo(),
  ])

  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        {announcementBar && <AnnouncementBar data={announcementBar} />}
        <ConditionalLayout
          key="layout"
          header={<Header categories={categories} collections={collections} navPages={navPages} navItems={navItems} menuPromo={menuPromo} siteLogo={siteLogo} />}
          footer={<Footer />}
        >
          {children}
        </ConditionalLayout>
        {isDraftMode && <VisualEditingWrapper key="visual-editing" />}
      </Providers>
    </NextIntlClientProvider>
  )
}
