import { defineField, defineType, defineArrayMember } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const multiColumnSection = defineType({
  name: 'multiColumnSection',
  title: 'Multi-Column',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string' }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (English)', type: 'string' }),
    defineField({ name: 'subtitle_ar', title: 'العنوان الفرعي (Arabic)', type: 'string' }),
    defineField({
      name: 'columnCount',
      title: 'Number of Columns',
      type: 'number',
      options: { list: [{ title: '2 Columns', value: 2 }, { title: '3 Columns', value: 3 }, { title: '4 Columns', value: 4 }] },
      initialValue: 3,
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'icon', title: 'Icon (emoji or name)', type: 'string' }),
            defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string' }),
            defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string' }),
            defineField({ name: 'body_en', title: 'Body (English)', type: 'text', rows: 3 }),
            defineField({ name: 'body_ar', title: 'النص (Arabic)', type: 'text', rows: 3 }),
            defineField({ name: 'cta', title: 'CTA Button (optional)', type: 'ctaButton' }),
          ],
          preview: { select: { title: 'headline_en', subtitle: 'icon' } },
        }),
      ],
    }),
    defineField({
      name: 'bgColor',
      title: 'Background Color',
      type: 'string',
      options: { list: [{ title: 'White', value: 'white' }, { title: 'Cream', value: 'cream' }, { title: 'Black', value: 'black' }], layout: 'radio' },
      initialValue: 'white',
    }),
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
      title: val.title || getSectionLabel('multiColumnSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('multiColumnSection'),
    }),
  },
})
