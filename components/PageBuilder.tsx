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
import type { HomePageSection } from '@/lib/types'

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
          return Block ? <Block key={s._key} data={s as any} /> : null
        })}
    </>
  )
}
