import { defineField, defineType, defineArrayMember } from 'sanity'

export const categoriesSection = defineType({
  name: 'categoriesSection',
  title: 'Categories',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title', title: 'Section Title', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: (val: { title?: string }) => ({ title: val.title ?? 'Categories', subtitle: 'categoriesSection' }),
  },
})
