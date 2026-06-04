import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const quizPromoSection = defineType({
  name: 'quizPromoSection',
  title: 'Scent Quiz Promo',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'eyebrow_en', title: 'Eyebrow (English)', type: 'string', initialValue: 'Discover Your Scent', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'eyebrow_ar', title: 'العنوان الصغير (Arabic)', type: 'string', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', initialValue: 'Find Your Perfect Fragrance', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'text', rows: 2, initialValue: 'Answer 5 quick questions and we\'ll match you with your ideal scent.', validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'subtext_ar', title: 'النص (Arabic)', type: 'text', rows: 2, validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'ctaLabel_en', title: 'Button Label (English)', type: 'string', initialValue: 'Take the Quiz', validation: (Rule) => Rule.max(40) }),
    defineField({ name: 'ctaLabel_ar', title: 'نص الزر (Arabic)', type: 'string', validation: (Rule) => Rule.max(40) }),
    defineField({ name: 'quizUrl', title: 'Quiz URL', type: 'string', description: 'Leave blank to use default /quiz route.', initialValue: '/quiz' }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Dark (charcoal background, ginger accent)', value: 'dark' },
          { title: 'Light (parchment background)', value: 'light' },
          { title: 'Accent (ginger background)', value: 'accent' },
        ],
        layout: 'radio',
      },
      initialValue: 'dark',
    }),
    defineField({
      name: 'bgImage',
      title: 'Background Image (optional)',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'steps',
      title: 'Steps / Features',
      type: 'array',
      description: 'Short feature points shown alongside the CTA (e.g. "5 questions · Instant results"). Max 4.',
      of: [{ type: 'string' }],
      initialValue: ['5 questions', 'Instant results', 'Expert matching'],
      validation: (Rule) => Rule.max(4),
    }),
  ],
  preview: {
    select: { title: 'headline_en', isVisible: 'isVisible' },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prepare: (val: any) => ({
      title: val.title || getSectionLabel('quizPromoSection'),
      subtitle: val.isVisible === false ? '🔴 Hidden' : '🟢 Visible',
      media: createSectionIcon('quizPromoSection'),
    }),
  },
})
