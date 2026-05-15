import { defineField, defineType, defineArrayMember } from 'sanity'

export const bestSellersSection = defineType({
  name: 'bestSellersSection',
  title: 'Best Sellers',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.max(80) }),
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
    select: { title: 'title' },
    prepare: (val: { title?: string }) => ({ title: val.title ?? 'Best Sellers', subtitle: 'bestSellersSection' }),
  },
})
