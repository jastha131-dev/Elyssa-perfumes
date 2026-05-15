import { defineField, defineType, defineArrayMember } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Add, reorder, and toggle visibility of homepage sections.',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'customBannerSection' }),
        defineArrayMember({ type: 'featuredProductsSection' }),
        defineArrayMember({ type: 'bestSellersSection' }),
        defineArrayMember({ type: 'categoriesSection' }),
        defineArrayMember({ type: 'marqueeSection' }),
        defineArrayMember({ type: 'scentBannerSection' }),
        defineArrayMember({ type: 'brandStorySection' }),
        defineArrayMember({ type: 'testimonialsSection' }),
        defineArrayMember({ type: 'newsletterSection' }),
        defineArrayMember({ type: 'trustBarSection' }),
      ],
    }),
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: {
    select: {},
    prepare() {
      return { title: 'Home Page', subtitle: 'Singleton document' }
    },
  } as any,
})
