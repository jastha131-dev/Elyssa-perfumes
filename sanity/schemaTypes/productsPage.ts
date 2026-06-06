import { defineField, defineType, defineArrayMember } from 'sanity'

const SECTION_TYPES = [
  'heroSection',
  'customBannerSection',
  'featuredProductsSection',
  'bestSellersSection',
  'categoriesSection',
  'marqueeSection',
  'scentBannerSection',
  'brandStorySection',
  'testimonialsSection',
  'newsletterSection',
  'trustBarSection',
  'videoBannerSection',
  'newArrivalsSection',
  'collectionsGridSection',
  'faqSection',
  'imageWithTextSection',
  'videoWithTextSection',
  'instagramFeedSection',
  'countdownTimerSection',
  'richTextSection',
  'multiColumnSection',
  'beforeAfterSection',
  'comparisonTableSection',
  'tabsSection',
  'upsellSection',
  'categoryTilesSection',
  'browseCategoriesSection',
  'quizPromoSection',
] as const

export const productsPage = defineType({
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  groups: [
    { name: 'above', title: '⬆ Sections Above Grid', default: true },
    { name: 'below', title: '⬇ Sections Below Grid' },
  ],
  fields: [
    defineField({
      name: 'sectionsAbove',
      title: 'Sections Above Product Grid',
      description: 'Sections rendered above the filters + product grid.',
      type: 'array',
      group: 'above',
      of: SECTION_TYPES.map((t) => defineArrayMember({ type: t })),
    }),
    defineField({
      name: 'sectionsBelow',
      title: 'Sections Below Product Grid',
      description: 'Sections rendered below the product grid (FAQs, newsletter, banners, etc.).',
      type: 'array',
      group: 'below',
      of: SECTION_TYPES.map((t) => defineArrayMember({ type: t })),
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return { title: 'Products Page' }
    },
  },
})
