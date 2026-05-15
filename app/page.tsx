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
import type {
  HeroSectionBlock,
  FeaturedProductsSectionBlock,
  BestSellersSectionBlock,
  CategoriesSectionBlock,
  TestimonialsSectionBlock,
} from "@/lib/types";

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

  const featuredBlock: FeaturedProductsSectionBlock = {
    _type: 'featuredProductsSection',
    _key: 'featured',
    products: featuredProducts,
  };

  const bestSellersBlock: BestSellersSectionBlock = {
    _type: 'bestSellersSection',
    _key: 'bestSellers',
    products: bestSellers,
  };

  const categoriesBlock: CategoriesSectionBlock = {
    _type: 'categoriesSection',
    _key: 'categories',
    categories,
  };

  const testimonialsBlock: TestimonialsSectionBlock = {
    _type: 'testimonialsSection',
    _key: 'testimonials',
    testimonials,
  };

  return (
    <>
      <Hero data={heroBlock} />
      <TrustBar />
      <FeaturedProducts data={featuredBlock} />
      <Categories data={categoriesBlock} />
      <MarqueeStrip />
      <BestSellers data={bestSellersBlock} />
      <ScentBanner data={homePage} />
      <Testimonials data={testimonialsBlock} />
      <BrandStory data={homePage} />
      <Newsletter />
    </>
  );
}
