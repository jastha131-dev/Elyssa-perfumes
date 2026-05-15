import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const featuredProductsSection = defineType({
  name: 'featuredProductsSection',
  title: 'Featured Products',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'subtitle', title: 'Section Subtitle', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
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
      title: 'title',
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
