import { defineField, defineType, defineArrayMember } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'content', title: 'Content Fields' },
    { name: 'pageBuilder', title: 'Page Sections' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Hero
    defineField({ name: 'heroHeadline_en', title: 'Hero Headline (English)', type: 'string', group: 'hero', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'heroHeadline_ar', title: 'العنوان الرئيسي (Arabic)', type: 'string', group: 'hero', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'heroSubline_en', title: 'Hero Subline (English)', type: 'text', rows: 2, group: 'hero', validation: (Rule) => Rule.max(300) }),
    defineField({ name: 'heroSubline_ar', title: 'العنوان الفرعي (Arabic)', type: 'text', rows: 2, group: 'hero', validation: (Rule) => Rule.max(300) }),
    defineField({ name: 'heroBgImage', title: 'Hero Background Image', type: 'image', group: 'hero', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })] }),
    defineField({
      name: 'overlayOpacity',
      title: 'Hero Overlay Darkness (0–100)',
      type: 'number',
      description: 'Controls how dark the hero background overlay is. Lower = more visible image. Default: 55',
      initialValue: 55,
      group: 'hero',
      validation: (R) => R.min(0).max(100),
    }),
    defineField({ name: 'heroEyebrow_en', title: 'Hero Eyebrow (English)', type: 'string', group: 'hero', initialValue: 'Our Story', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'heroEyebrow_ar', title: 'النص العلوي (Arabic)', type: 'string', group: 'hero', validation: (Rule) => Rule.max(60) }),

    // Stats
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'content',
      description: 'Key numbers shown in the story section.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', validation: (Rule) => Rule.required().max(20) }),
            defineField({ name: 'label_en', title: 'Label (English)', type: 'string', validation: (Rule) => Rule.required().max(60) }),
            defineField({ name: 'label_ar', title: 'التسمية (Arabic)', type: 'string', validation: (Rule) => Rule.max(60) }),
          ],
          preview: { select: { title: 'value', subtitle: 'label_en' } },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // Philosophy
    defineField({ name: 'philosophyHeadline_en', title: 'Philosophy Headline (English)', type: 'string', group: 'content', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'philosophyHeadline_ar', title: 'عنوان الفلسفة (Arabic)', type: 'string', group: 'content', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'philosophyBody_en', title: 'Philosophy Body (English)', type: 'array', group: 'content', of: [{ type: 'block' }] }),
    defineField({ name: 'philosophyBody_ar', title: 'نص الفلسفة (Arabic)', type: 'array', group: 'content', of: [{ type: 'block' }] }),

    // Pillars
    defineField({
      name: 'pillars',
      title: 'Brand Pillars',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'number', title: 'Number', type: 'string', description: 'e.g. 01, 02', validation: (Rule) => Rule.required().max(4) }),
            defineField({ name: 'title_en', title: 'Title (English)', type: 'string', validation: (Rule) => Rule.required().max(80) }),
            defineField({ name: 'title_ar', title: 'العنوان (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
            defineField({ name: 'body_en', title: 'Body (English)', type: 'text', rows: 3, validation: (Rule) => Rule.required().max(400) }),
            defineField({ name: 'body_ar', title: 'النص (Arabic)', type: 'text', rows: 3, validation: (Rule) => Rule.max(400) }),
          ],
          preview: { select: { title: 'title_en', subtitle: 'number' } },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // Timeline
    defineField({
      name: 'timeline',
      title: 'Timeline / Milestones',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'year', title: 'Year', type: 'string', validation: (Rule) => Rule.required().max(10) }),
            defineField({ name: 'event_en', title: 'Event (English)', type: 'text', rows: 2, validation: (Rule) => Rule.required().max(300) }),
            defineField({ name: 'event_ar', title: 'الحدث (Arabic)', type: 'text', rows: 2, validation: (Rule) => Rule.max(300) }),
          ],
          preview: { select: { title: 'year', subtitle: 'event_en' } },
        }),
      ],
    }),

    // CTA
    defineField({ name: 'ctaHeadline_en', title: 'CTA Headline (English)', type: 'string', group: 'content', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'ctaHeadline_ar', title: 'عنوان الدعوة (Arabic)', type: 'string', group: 'content', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'ctaBody_en', title: 'CTA Body (English)', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.max(400) }),
    defineField({ name: 'ctaBody_ar', title: 'نص الدعوة (Arabic)', type: 'text', rows: 3, group: 'content', validation: (Rule) => Rule.max(400) }),
    defineField({ name: 'ctaPrimary', title: 'Primary CTA', type: 'ctaButton', group: 'content' }),
    defineField({ name: 'ctaSecondary', title: 'Secondary CTA', type: 'ctaButton', group: 'content' }),

    // PageBuilder — extra sections below the main content
    defineField({
      name: 'sections',
      title: 'Extra Page Sections',
      group: 'pageBuilder',
      type: 'array',
      description: 'Add extra sections below the main About content.',
      of: [
        defineArrayMember({ type: 'customBannerSection' }),
        defineArrayMember({ type: 'videoBannerSection' }),
        defineArrayMember({ type: 'imageWithTextSection' }),
        defineArrayMember({ type: 'videoWithTextSection' }),
        defineArrayMember({ type: 'richTextSection' }),
        defineArrayMember({ type: 'multiColumnSection' }),
        defineArrayMember({ type: 'testimonialsSection' }),
        defineArrayMember({ type: 'instagramFeedSection' }),
        defineArrayMember({ type: 'beforeAfterSection' }),
        defineArrayMember({ type: 'tabsSection' }),
        defineArrayMember({ type: 'newsletterSection' }),
        defineArrayMember({ type: 'brandStorySection' }),
        defineArrayMember({ type: 'marqueeSection' }),
      ],
    }),

    // SEO
    defineField({ name: 'seoTitle_en', title: 'SEO Title (English)', type: 'string', group: 'seo', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'seoTitle_ar', title: 'عنوان SEO (Arabic)', type: 'string', group: 'seo', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'seoDescription_en', title: 'SEO Description (English)', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.max(160) }),
    defineField({ name: 'seoDescription_ar', title: 'وصف SEO (Arabic)', type: 'text', rows: 2, group: 'seo', validation: (Rule) => Rule.max(160) }),
  ],
  preview: {
    select: {},
    prepare() { return { title: 'About Page', subtitle: 'Singleton document' } },
  },
})
