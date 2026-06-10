import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const collectionsGridSection = defineType({
  name: 'collectionsGridSection',
  title: 'Collections Grid',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string' }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (English)', type: 'string' }),
    defineField({ name: 'subtitle_ar', title: 'العنوان الفرعي (Arabic)', type: 'string' }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'collection' }] })],
    }),
    defineField({
      name: 'columnCount',
      title: 'Columns',
      type: 'number',
      options: { list: [{ title: '2 Columns', value: 2 }, { title: '3 Columns', value: 3 }, { title: '4 Columns', value: 4 }] },
      initialValue: 3,
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
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
      title: val.title || getSectionLabel('collectionsGridSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('collectionsGridSection'),
    }),
  },
})
