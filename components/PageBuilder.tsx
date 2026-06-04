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
