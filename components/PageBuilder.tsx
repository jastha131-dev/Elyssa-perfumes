'use client'

import React, { useLayoutEffect, useRef, useState } from 'react'
import Hero from '@/components/home/Hero'
import TrustBar from '@/components/home/TrustBar'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import MarqueeStrip from '@/components/home/MarqueeStrip'
import Categories from '@/components/home/Categories'
import BestSellers from '@/components/home/BestSellers'
import ScentBanner from '@/components/home/ScentBanner'
import Testimonials from '@/components/home/Testimonials'
import BrandStory from '@/components/home/BrandStory'
import Newsletter from '@/components/home/Newsletter'
import CustomBanner from '@/components/home/CustomBanner'
import VideoBanner from '@/components/home/VideoBanner'
import NewArrivals from '@/components/home/NewArrivals'
import CollectionsGrid from '@/components/home/CollectionsGrid'
import FaqAccordion from '@/components/home/FaqAccordion'
import ImageWithText from '@/components/home/ImageWithText'
import VideoWithText from '@/components/home/VideoWithText'
import InstagramFeed from '@/components/home/InstagramFeed'
import CountdownTimer from '@/components/home/CountdownTimer'
import RichText from '@/components/home/RichText'
import MultiColumn from '@/components/home/MultiColumn'
import BeforeAfter from '@/components/home/BeforeAfter'
import ComparisonTable from '@/components/home/ComparisonTable'
import Tabs from '@/components/home/Tabs'
import UpsellProducts from '@/components/home/UpsellProducts'
import CategoryTilesSection from '@/components/home/CategoryTilesSection'
import BrowseCategories from '@/components/home/BrowseCategories'
import QuizPromo from '@/components/home/QuizPromo'
import type { HomePageSection } from '@/lib/types'

const BG_MAP: Record<string, string> = {
  white: '#ffffff',
  cream: 'var(--stone, #F4F4EE)',
  'cream-soft': 'var(--cream, #EBEBDF)',
  'accent-light': 'var(--camel-light, #FEF3EC)',
  accent: 'var(--camel, #E9631A)',
  dark: 'var(--ink, #323232)',
  black: '#000000',
}

const BADGE_MAP: Record<string, string> = {
  gold: 'var(--camel, #E9631A)',
  white: '#ffffff',
  black: '#000000',
  rose: '#C0476A',
  sage: '#4A7C59',
}

const RADIUS_MAP: Record<string, string> = {
  sm: '4px',
  md: '12px',
  lg: '24px',
  xl: '40px',
}

const PAD_MAP: Record<string, string> = {
  none: '0px',
  sm: '32px',
  lg: '96px',
  xl: '128px',
}

const blockMap: Record<string, React.ComponentType<{ data: any }>> = {
  heroSection: Hero,
  customBannerSection: CustomBanner,
  featuredProductsSection: FeaturedProducts,
  bestSellersSection: BestSellers,
  categoriesSection: Categories,
  marqueeSection: MarqueeStrip,
  scentBannerSection: ScentBanner,
  brandStorySection: BrandStory,
  testimonialsSection: Testimonials,
  newsletterSection: Newsletter,
  trustBarSection: TrustBar,
  videoBannerSection: VideoBanner,
  newArrivalsSection: NewArrivals,
  collectionsGridSection: CollectionsGrid,
  faqSection: FaqAccordion,
  imageWithTextSection: ImageWithText,
  videoWithTextSection: VideoWithText,
  instagramFeedSection: InstagramFeed,
  countdownTimerSection: CountdownTimer,
  richTextSection: RichText,
  multiColumnSection: MultiColumn,
  beforeAfterSection: BeforeAfter,
  comparisonTableSection: ComparisonTable,
  tabsSection: Tabs,
  upsellSection: UpsellProducts,
  categoryTilesSection: CategoryTilesSection,
  browseCategoriesSection: BrowseCategories,
  quizPromoSection: QuizPromo,
}

function ThemedSection({
  Block, data, wrapStyle, cornerRadius,
}: {
  Block: React.ComponentType<{ data: any }>
  data: any
  wrapStyle: React.CSSProperties
  cornerRadius?: string
}) {
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (ref.current && !ref.current.firstChild) setVisible(false)
  }, [])

  if (!visible) return null
  return (
    <div ref={ref} style={wrapStyle} className={cornerRadius && cornerRadius !== 'none' ? 'overflow-hidden' : undefined}>
      <Block data={data} />
    </div>
  )
}

interface PageBuilderProps {
  sections?: HomePageSection[]
}

export default function PageBuilder({ sections }: PageBuilderProps) {
  if (!sections?.length) return null

  return (
    <>
      {sections
        .filter((s) => s.isVisible !== false)
        .map((s) => {
          const Block = blockMap[s._type]
          if (!Block) return null

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const theme = (s as any).theme
          if (!theme || (theme.bgColor === 'default' && theme.cornerRadius === 'none' && theme.paddingY === 'md' && !theme.badgeColor)) {
            return <Block key={s._key} data={s as any} />
          }

          const wrapStyle: React.CSSProperties = {
            ...(theme.bgColor && theme.bgColor !== 'default' && { '--section-bg': BG_MAP[theme.bgColor] }),
            ...(theme.badgeColor && theme.badgeColor !== 'default' && { '--section-badge': BADGE_MAP[theme.badgeColor] }),
            ...(theme.cornerRadius && theme.cornerRadius !== 'none' && { borderRadius: RADIUS_MAP[theme.cornerRadius], overflow: 'hidden' }),
            ...(theme.paddingY && theme.paddingY !== 'md' && theme.paddingY !== 'none' && { paddingTop: PAD_MAP[theme.paddingY] ?? undefined, paddingBottom: PAD_MAP[theme.paddingY] ?? undefined }),
            ...(theme.paddingY === 'none' && { paddingTop: '0', paddingBottom: '0' }),
            ...(theme.bgColor && theme.bgColor !== 'default' && { backgroundColor: BG_MAP[theme.bgColor] }),
          }

          return (
            <ThemedSection key={s._key} Block={Block} data={s as any} wrapStyle={wrapStyle} cornerRadius={theme.cornerRadius} />
          )
        })}
    </>
  )
}
