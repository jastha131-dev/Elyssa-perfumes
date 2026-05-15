import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const featuredProductsSection = defineType({
  name: 'featuredProductsSection',
  title: 'Featured Products',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'subtitle_en', title: 'Section Subtitle (English)', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'subtitle_ar', title: 'العنوان الفرعي (Arabic)', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.required().min(1).max(8).unique(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Grid', value: 'grid' },
          { title: 'Carousel', value: 'carousel' },
        ],
        layout: 'radio',
      },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: {
      title: 'title_en',
      isVisible: 'isVisible',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('featuredProductsSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('featuredProductsSection'),
    }),
  },
})
