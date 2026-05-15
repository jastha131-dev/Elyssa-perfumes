import PageBuilder from '@/components/PageBuilder'
import { getHomePage } from '@/lib/sanity/fetch'
import { draftModeClient } from '@/lib/sanity/client'
import { getHomePageQuery } from '@/lib/sanity/queries'
import { draftMode } from 'next/headers'

export default async function HomePage() {
  let homePage
  try {
    const { isEnabled } = await draftMode()
    if (isEnabled) {
      homePage = await draftModeClient.fetch(getHomePageQuery)
    } else {
      homePage = await getHomePage()
    }
  } catch {
    homePage = await getHomePage()
  }

  return <PageBuilder sections={homePage?.sections} />
}
