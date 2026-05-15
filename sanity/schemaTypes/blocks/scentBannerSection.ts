import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const scentBannerSection = defineType({
  name: 'scentBannerSection',
  title: 'Scent Banner',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'eyebrow_en', title: 'Eyebrow Label (English)', type: 'string', description: 'e.g. "Explore by Note"', validation: (Rule) => Rule.max(50) }),
    defineField({ name: 'eyebrow_ar', title: 'النص العلوي (Arabic)', type: 'string', validation: (Rule) => Rule.max(50) }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', description: 'Use \\n to split into lines.', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
    defineField({ name: 'highlightWord_en', title: 'Highlighted Word(s) (English)', type: 'string', description: 'Italic gold portion of headline, e.g. "A Story"', validation: (Rule) => Rule.max(40) }),
    defineField({ name: 'highlightWord_ar', title: 'الكلمة المميزة (Arabic)', type: 'string', validation: (Rule) => Rule.max(40) }),
    defineField({ name: 'subtext_en', title: 'Body Text (English)', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({ name: 'subtext_ar', title: 'النص التوضيحي (Arabic)', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({
      name: 'bgImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({ name: 'cta', title: 'CTA Button', type: 'ctaButton' }),
  ],
  preview: {
    select: {
      title: 'headline_en',
      isVisible: 'isVisible',
      image: 'bgImage',
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('scentBannerSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: val.image || createSectionIcon('scentBannerSection'),
    }),
  },
})
