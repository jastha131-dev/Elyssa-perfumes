import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import MarqueeStrip from "@/components/home/MarqueeStrip";
import Categories from "@/components/home/Categories";
import BestSellers from "@/components/home/BestSellers";
import ScentBanner from "@/components/home/ScentBanner";
import Testimonials from "@/components/home/Testimonials";
import BrandStory from "@/components/home/BrandStory";
import Newsletter from "@/components/home/Newsletter";
import {
  getFeaturedProducts,
  getBestSellerProducts,
  getHomePage,
  getAllCategories,
  getTestimonials,
} from "@/lib/sanity/fetch";
import type { HeroSectionBlock } from "@/lib/types";

export default async function HomePage() {
  const [homePage, featuredProducts, bestSellers, categories, testimonials] =
    await Promise.all([
      getHomePage(),
      getFeaturedProducts(),
      getBestSellerProducts(),
      getAllCategories(),
      getTestimonials(),
    ]);

  const heroBlock = homePage?.sections?.find(
    (s): s is HeroSectionBlock => s._type === 'heroSection'
  ) ?? null;

  return (
    <>
      <Hero data={heroBlock} />
      <TrustBar />
      <FeaturedProducts products={featuredProducts} />
      <Categories categories={categories} />
      <MarqueeStrip />
      <BestSellers products={bestSellers} />
      <ScentBanner data={homePage} />
      <Testimonials testimonials={testimonials} />
      <BrandStory data={homePage} />
      <Newsletter />
    </>
  );
}
