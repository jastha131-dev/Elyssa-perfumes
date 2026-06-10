import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const beforeAfterSection = defineType({
  name: 'beforeAfterSection',
  title: 'Before / After',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'title_en', title: 'Section Title (English)', type: 'string' }),
    defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({ name: 'subtitle_en', title: 'Subtitle (English)', type: 'string' }),
    defineField({ name: 'subtitle_ar', title: 'العنوان الفرعي (Arabic)', type: 'string' }),
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({ name: 'beforeLabel_en', title: 'Before Label (English)', type: 'string', initialValue: 'Before' }),
    defineField({ name: 'beforeLabel_ar', title: 'تسمية قبل (Arabic)', type: 'string' }),
    defineField({ name: 'afterLabel_en', title: 'After Label (English)', type: 'string', initialValue: 'After' }),
    defineField({ name: 'afterLabel_ar', title: 'تسمية بعد (Arabic)', type: 'string' }),
    defineField({ name: 'initialPosition', title: 'Initial Slider Position (%)', type: 'number', initialValue: 50 }),
    defineField({
      name: 'theme',
      title: 'Section Styling',
      type: 'sectionTheme',
      description: 'Override background, badge color, corner radius and padding for this section.',
    }),
  ],
  preview: {
    select: { title: 'title_en', isVisible: 'isVisible', image: 'beforeImage' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('beforeAfterSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('beforeAfterSection'),
    }),
  },
})
