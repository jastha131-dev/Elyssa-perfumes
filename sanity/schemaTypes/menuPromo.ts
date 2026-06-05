import { defineField, defineType } from 'sanity'

export const menuPromo = defineType({
  name: 'menuPromo',
  title: 'Menu Promo (Mega-menu editorial card)',
  type: 'document',
  fields: [
    defineField({ name: 'badge_en', title: 'Badge (English)', type: 'string', initialValue: 'New Season', validation: (R) => R.max(30) }),
    defineField({ name: 'badge_ar', title: 'الشارة (Arabic)', type: 'string', validation: (R) => R.max(30) }),
    defineField({ name: 'label_en', title: 'Eyebrow Label (English)', type: 'string', initialValue: 'Spring / Summer', validation: (R) => R.max(40) }),
    defineField({ name: 'label_ar', title: 'العنوان الصغير (Arabic)', type: 'string', validation: (R) => R.max(40) }),
    defineField({ name: 'headline_en', title: 'Headline (English)', type: 'string', initialValue: 'Spring Summer Story', validation: (R) => R.max(60) }),
    defineField({ name: 'headline_ar', title: 'العنوان (Arabic)', type: 'string', validation: (R) => R.max(60) }),
    defineField({ name: 'subtext_en', title: 'Subtext (English)', type: 'text', rows: 2, initialValue: 'Rare fragrances crafted for the discerning soul.', validation: (R) => R.max(160) }),
    defineField({ name: 'subtext_ar', title: 'النص (Arabic)', type: 'text', rows: 2, validation: (R) => R.max(160) }),
    defineField({ name: 'ctaLabel_en', title: 'Button Label (English)', type: 'string', initialValue: 'Shop Now', validation: (R) => R.max(30) }),
    defineField({ name: 'ctaLabel_ar', title: 'نص الزر (Arabic)', type: 'string', validation: (R) => R.max(30) }),
    defineField({ name: 'ctaLink', title: 'Button Link', type: 'string', initialValue: '/products' }),
    defineField({
      name: 'image',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
  ],
  preview: {
    select: { title: 'headline_en' },
    prepare: (v) => ({ title: v.title || 'Menu Promo', subtitle: 'Mega-menu editorial card' }),
  },
})
