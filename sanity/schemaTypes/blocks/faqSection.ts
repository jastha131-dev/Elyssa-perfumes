import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ Accordion',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (English)', type: 'string', validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'subtitle_ar', title: 'العنوان الفرعي (Arabic)', type: 'string', validation: (Rule) => Rule.max(200) }),
    defineField({
      name: 'faqs',
      title: 'FAQ Items',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'faqItem' }] })],
      validation: (Rule) => Rule.required().min(1).max(20).unique(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: [{ title: 'Single Column', value: 'single-column' }, { title: 'Two Columns', value: 'two-column' }], layout: 'radio' },
      initialValue: 'single-column',
    }),
  ],
  preview: {
    select: { title: 'title_en', isVisible: 'isVisible' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('faqSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('faqSection'),
    }),
  },
})
