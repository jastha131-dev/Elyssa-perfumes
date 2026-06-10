import { defineField, defineType } from 'sanity'
import { createSectionIcon, getSectionLabel } from '../../components/SectionMediaIcon'

export const quizPromoSection = defineType({
  name: 'quizPromoSection',
  title: 'Scent Quiz Promo',
  type: 'object',
  fields: [
    defineField({ name: 'isVisible', title: 'Visible', type: 'boolean', initialValue: true }),
    defineField({ name: 'eyebrow_en', title: 'Eyebrow (English)', type: 'string', initialValue: 'Discover Your Scent' }),
    defineField({ name: 'eyebrow_ar', title: 'العنوان الصغير (Arabic)', type: 'string' }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', initialValue: 'Find Your Perfect Fragrance' }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string' }),
    defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'text', rows: 2, initialValue: 'Answer 5 quick questions and we\'ll match you with your ideal scent.' }),
    defineField({ name: 'subtext_ar', title: 'النص (Arabic)', type: 'text', rows: 2 }),
    defineField({ name: 'ctaLabel_en', title: 'Button Label (English)', type: 'string', initialValue: 'Take the Quiz' }),
    defineField({ name: 'ctaLabel_ar', title: 'نص الزر (Arabic)', type: 'string' }),
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
    }),
    // ── Preview card (right side mockup) ──
    defineField({ name: 'previewLabel_en', title: 'Preview Card Label (English)', type: 'string', initialValue: 'Scent Finder' }),
    defineField({ name: 'previewLabel_ar', title: 'تسمية البطاقة (Arabic)', type: 'string' }),
    defineField({ name: 'previewQuestion_en', title: 'Preview Question (English)', type: 'string', initialValue: "What's your ideal mood?" }),
    defineField({ name: 'previewQuestion_ar', title: 'سؤال المعاينة (Arabic)', type: 'string' }),
    defineField({
      name: 'previewOptions', title: 'Preview Options', type: 'array',
      of: [{ type: 'object', name: 'opt', fields: [
        { name: 'label_en', type: 'string', title: 'Label (English)' },
        { name: 'label_ar', type: 'string', title: 'التسمية (Arabic)' },
      ], preview: { select: { title: 'label_en' } } }],
    }),
    defineField({ name: 'previewProgress_en', title: 'Preview Progress Text (English)', type: 'string', initialValue: 'Question 2 of 5' }),
    defineField({ name: 'previewProgress_ar', title: 'نص التقدّم (Arabic)', type: 'string' }),
    defineField({
      name: 'theme',
      title: 'Section Styling',
      type: 'sectionTheme',
      description: 'Override background, badge color, corner radius and padding for this section.',
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
