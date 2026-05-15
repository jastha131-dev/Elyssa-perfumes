import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

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
    select: {
      title: 'title',
      isVisible: 'isVisible',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('categoriesSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('categoriesSection'),
    }),
  },
})
