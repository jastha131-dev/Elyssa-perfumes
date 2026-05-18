import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/layout/Providers'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import VisualEditingWrapper from '@/components/VisualEditingWrapper'
import { getAllCategories, getNavPages, getNavConfig } from '@/lib/sanity/fetch'

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
  const [categories, navPages, navItems] = await Promise.all([getAllCategories(), getNavPages(), getNavConfig()])

  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <ConditionalLayout
          key="layout"
          header={<Header categories={categories} navPages={navPages} navItems={navItems} />}
          footer={<Footer />}
        >
          {children}
        </ConditionalLayout>
        {isDraftMode && <VisualEditingWrapper key="visual-editing" />}
      </Providers>
    </NextIntlClientProvider>
  )
}
