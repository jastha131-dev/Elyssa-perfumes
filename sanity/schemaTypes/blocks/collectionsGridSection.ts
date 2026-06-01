import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const collectionsGridSection = defineType({
  name: 'collectionsGridSection',
  title: 'Collections Grid',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (English)', type: 'string', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'subtitle_ar', title: 'العنوان الفرعي (Arabic)', type: 'string', validation: (Rule) => Rule.max(160) }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'collection' }] })],
      validation: (Rule) => Rule.required().min(1).max(12).unique(),
    }),
    defineField({
      name: 'columnCount',
      title: 'Columns',
      type: 'number',
      options: { list: [{ title: '2 Columns', value: 2 }, { title: '3 Columns', value: 3 }, { title: '4 Columns', value: 4 }] },
      initialValue: 3,
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
  ],
  preview: {
    select: { title: 'title_en', isVisible: 'isVisible' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('collectionsGridSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('collectionsGridSection'),
    }),
  },
})
