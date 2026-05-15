import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const bestSellersSection = defineType({
  name: 'bestSellersSection',
  title: 'Best Sellers',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      description: 'Select products to feature as best sellers.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.required().min(1).max(12).unique(),
    }),
  ],
  preview: {
    select: {
      title: 'title_en',
      isVisible: 'isVisible',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('bestSellersSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('bestSellersSection'),
    }),
  },
})
