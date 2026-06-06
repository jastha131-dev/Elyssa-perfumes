import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const comparisonTableSection = defineType({
  name: 'comparisonTableSection',
  title: 'Comparison Table',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({
      name: 'products',
      title: 'Products to Compare',
      type: 'array',
      description: 'Select 2–4 products.',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'product' }] })],
      validation: (Rule) => Rule.required().min(2).max(4).unique(),
    }),
    defineField({ name: 'highlightProductIndex', title: 'Highlight Column (0-based index)', type: 'number', description: '0 = first product, 1 = second, etc.', initialValue: 0, validation: (Rule) => Rule.min(0).max(3) }),
    defineField({ name: 'showAddToCart', title: 'Show Add to Cart Buttons', type: 'boolean', initialValue: true }),
    defineField({
      name: 'theme',
      title: 'Section Styling',
      type: 'sectionTheme',
      description: 'Override background, badge color, corner radius and padding for this section.',
    }),
  ],
  preview: {
    select: { title: 'title_en', isVisible: 'isVisible' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('comparisonTableSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('comparisonTableSection'),
    }),
  },
})
