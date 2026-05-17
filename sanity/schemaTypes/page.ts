import { defineField, defineType, defineArrayMember } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title_en',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required().max(60),
    }),
    defineField({
      name: 'title_ar',
      title: 'العنوان (Arabic)',
      type: 'string',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'title_en', maxLength: 50 },
      description: 'Auto-generated from title. Page will be at /en/pages/your-slug',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'showInNav',
      title: 'Show in Navigation',
      type: 'boolean',
      description: 'Show this page as a link in the website header.',
      initialValue: false,
    }),
    defineField({
      name: 'navOrder',
      title: 'Navigation Order',
      type: 'number',
      description: 'Lower number = appears earlier in the nav. Default: 10.',
      initialValue: 10,
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      description: 'Build this page using the same blocks as the homepage.',
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
  preview: {
    select: {
      title: 'title_en',
      slug: 'slug.current',
      showInNav: 'showInNav',
    },
    prepare({ title, slug, showInNav }: { title?: string; slug?: string; showInNav?: boolean }) {
      return {
        title: title || 'Untitled Page',
        subtitle: `/${slug ?? '…'} ${showInNav ? '· In Nav ✓' : ''}`,
      }
    },
  },
})
