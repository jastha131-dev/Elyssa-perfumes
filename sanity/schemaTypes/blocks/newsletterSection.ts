import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const newsletterSection = defineType({
  name: 'newsletterSection',
  title: 'Newsletter',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'subtext_ar', title: 'النص التوضيحي (Arabic)', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'buttonLabel_en', title: 'Button Label (English)', type: 'string', initialValue: 'Subscribe', validation: (Rule) => Rule.max(40) }),
    defineField({ name: 'buttonLabel_ar', title: 'نص الزر (Arabic)', type: 'string', validation: (Rule) => Rule.max(40) }),
    defineField({
      name: 'bgImage',
      title: 'Background Image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
  ],
  preview: {
    select: {
      title: 'headline_en',
      isVisible: 'isVisible',
      image: 'bgImage',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('newsletterSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('newsletterSection'),
    }),
  },
})
