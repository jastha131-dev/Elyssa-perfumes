import PageBuilder from '@/components/PageBuilder'
import { getHomePage } from '@/lib/sanity/fetch'
import { draftModeClient } from '@/lib/sanity/client'
import { getHomePageQuery } from '@/lib/sanity/queries'
import { draftMode } from 'next/headers'
import type { HomePage } from '@/lib/types'

export default async function HomePage() {
  let isDraftMode = false
  try {
    const { isEnabled } = await draftMode()
    isDraftMode = isEnabled
  } catch {
    // draftMode() throws outside request context (e.g. static generation)
  }

  const homePage: HomePage | null = isDraftMode
    ? await draftModeClient.fetch(getHomePageQuery)
    : await getHomePage()

  return <PageBuilder sections={homePage?.sections} />
}
