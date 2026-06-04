// sanity/schemaTypes/giftCardPage.ts
import { defineField, defineType, defineArrayMember } from 'sanity'

export const giftCardPage = defineType({
  name: 'giftCardPage',
  title: 'Gift Card Page',
  type: 'document',
  // Restrict Studio to update/publish only — prevents creating or deleting this singleton
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(({ __experimental_actions: ['update', 'publish'] }) as any),
  fields: [
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', validation: (Rule) => Rule.required().max(120) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(120) }),
    defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({ name: 'subtext_ar', title: 'النص الفرعي (Arabic)', type: 'text', rows: 3, validation: (Rule) => Rule.max(300) }),
    defineField({
      name: 'denominations',
      title: 'Denominations',
      type: 'array',
      validation: (Rule) => Rule.min(1),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label_en', title: 'Label (English)', type: 'string', description: 'e.g. Perfect for beginners', validation: (Rule) => Rule.required().max(80) }),
            defineField({ name: 'label_ar', title: 'التسمية (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
            defineField({ name: 'amountCents', title: 'Amount (cents)', type: 'number', description: 'e.g. 10000 for $100', validation: (Rule) => Rule.required().min(100) }),
            defineField({ name: 'popular', title: 'Mark as Popular', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'label_en', subtitle: 'amountCents' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (val: any) => ({ title: val.title, subtitle: `$${Math.round(val.amountCents / 100)}` }),
          },
        }),
      ],
    }),
    defineField({
      name: 'howItWorks',
      title: 'How It Works Steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'step', title: 'Step Number', type: 'number', validation: (Rule) => Rule.required().min(1) }),
            defineField({ name: 'text_en', title: 'Step Text (English)', type: 'string', validation: (Rule) => Rule.required().max(150) }),
            defineField({ name: 'text_ar', title: 'نص الخطوة (Arabic)', type: 'string', validation: (Rule) => Rule.max(150) }),
          ],
          preview: {
            select: { title: 'text_en', subtitle: 'step' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare: (val: any) => ({ title: val.title, subtitle: `Step ${val.subtitle}` }),
          },
        }),
      ],
    }),
    defineField({ name: 'terms_en', title: 'Terms & Conditions (English)', type: 'text', rows: 4 }),
    defineField({ name: 'terms_ar', title: 'الشروط والأحكام (Arabic)', type: 'text', rows: 4 }),
  ],
})
