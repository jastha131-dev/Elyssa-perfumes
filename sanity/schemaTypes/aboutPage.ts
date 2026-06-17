import { defineField, defineType, defineArrayMember } from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'story', title: 'Our Story & Timeline' },
    { name: 'trust', title: 'Why Trust Us' },
    { name: 'founders', title: 'Meet The Founders' },
    { name: 'gallery', title: 'Behind The Bottle' },
    { name: 'closing', title: 'Closing & CTA' },
    { name: 'pageBuilder', title: 'Extra Sections (Reviews etc.)' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ── Hero ─────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline_en',
      title: 'Hero Headline (English)',
      type: 'string',
      group: 'hero',
      initialValue: 'Crafted Through 20 Years of Fragrance Expertise',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({ name: 'heroHeadline_ar', title: 'العنوان الرئيسي (Arabic)', type: 'string', group: 'hero', validation: (Rule) => Rule.max(100) }),
    defineField({
      name: 'heroSubline_en',
      title: 'Hero Subline (English)',
      type: 'text',
      rows: 3,
      group: 'hero',
      initialValue: 'From a 400 sq. ft. perfume shop in 2005 to creating thousands of custom fragrances trusted by customers across Dubai and beyond.',
      validation: (Rule) => Rule.max(300),
    }),
    defineField({ name: 'heroSubline_ar', title: 'العنوان الفرعي (Arabic)', type: 'text', rows: 3, group: 'hero', validation: (Rule) => Rule.max(300) }),
    defineField({
      name: 'heroBgImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'overlayOpacity',
      title: 'Hero Overlay Darkness (0–100)',
      type: 'number',
      description: 'Controls how dark the hero background overlay is. Lower = more visible image. Default: 55',
      initialValue: 55,
      group: 'hero',
      validation: (R) => R.min(0).max(100),
    }),
    defineField({ name: 'heroEyebrow_en', title: 'Hero Eyebrow Label (English)', type: 'string', group: 'hero', initialValue: 'Our Story', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'heroEyebrow_ar', title: 'النص العلوي (Arabic)', type: 'string', group: 'hero', validation: (Rule) => Rule.max(60) }),
    defineField({
      name: 'heroLead_en',
      title: 'Hero Lead Statement (English)',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Short supporting statement shown lower in the hero column (fills the empty space).',
      initialValue: 'A Dubai house of fragrance, composing scent as a form of memory since 2005.',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({ name: 'heroLead_ar', title: 'العبارة التمهيدية (Arabic)', type: 'text', rows: 2, group: 'hero', validation: (Rule) => Rule.max(200) }),
    defineField({ name: 'heroLeadLabel_en', title: 'Hero Lead Label (English)', type: 'string', group: 'hero', initialValue: 'Est. 2005 · Dubai', validation: (Rule) => Rule.max(60) }),
    defineField({ name: 'heroLeadLabel_ar', title: 'تسمية العبارة (Arabic)', type: 'string', group: 'hero', validation: (Rule) => Rule.max(60) }),

    // ── Stats Bar ────────────────────────────────────────────────
    defineField({ name: 'showStats', title: 'Show Stats Strip', type: 'boolean', group: 'story', initialValue: true }),
    defineField({
      name: 'stats',
      title: 'Stats Bar',
      type: 'array',
      group: 'story',
      description: 'Key numbers shown below the hero. Recommended: 4–5 stats.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value (e.g. 20+)', type: 'string', validation: (Rule) => Rule.required().max(20) }),
            defineField({ name: 'label_en', title: 'Label (English)', type: 'string', validation: (Rule) => Rule.required().max(60) }),
            defineField({ name: 'label_ar', title: 'التسمية (Arabic)', type: 'string', validation: (Rule) => Rule.max(60) }),
          ],
          preview: { select: { title: 'value', subtitle: 'label_en' } },
        }),
      ],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: 'statsStripColor',
      title: 'Stats Strip Background',
      type: 'string',
      group: 'story',
      description: 'Background colour of the stats bar below the hero.',
      initialValue: 'camel',
      options: {
        list: [
          { title: 'Amber / Camel (default)', value: 'camel' },
          { title: 'Warm Cream', value: 'cream' },
          { title: 'Charcoal Dark', value: 'charcoal' },
          { title: 'White', value: 'white' },
        ],
        layout: 'radio',
      },
    }),

    // ── Our Story ────────────────────────────────────────────────
    defineField({ name: 'showStory', title: 'Show Our Story Section', type: 'boolean', group: 'story', initialValue: true }),
    defineField({
      name: 'philosophyHeadline_en',
      title: 'Our Story Headline (English)',
      type: 'string',
      group: 'story',
      initialValue: 'A Family Legacy of Fragrance',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({ name: 'philosophyHeadline_ar', title: 'عنوان قصتنا (Arabic)', type: 'string', group: 'story', validation: (Rule) => Rule.max(100) }),
    defineField({
      name: 'philosophyBody_en',
      title: 'Our Story Body (English)',
      description: 'The full story of Elyssa Perfumes — founders, history, mission.',
      type: 'array',
      group: 'story',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'philosophyBody_ar', title: 'نص قصتنا (Arabic)', type: 'array', group: 'story', of: [{ type: 'block' }] }),
    defineField({
      name: 'storyImage',
      title: 'Our Story Image',
      type: 'image',
      group: 'story',
      description: 'Image shown alongside the story text — original shop or showroom photo works well.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),

    // ── Timeline ─────────────────────────────────────────────────
    defineField({ name: 'showTimeline', title: 'Show Timeline / Milestones', type: 'boolean', group: 'story', initialValue: true }),
    defineField({
      name: 'timeline',
      title: 'Timeline / Milestones',
      type: 'array',
      group: 'story',
      description: 'Key moments in your brand journey. Shown as a vertical timeline.',
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

    // ── Why Trust Us (Pillars) ───────────────────────────────────
    defineField({ name: 'showPillars', title: 'Show Why Trust Us Section', type: 'boolean', group: 'trust', initialValue: true }),
    defineField({
      name: 'pillars',
      title: 'Why Trust Us — Cards',
      type: 'array',
      group: 'trust',
      description: 'Reasons customers trust your brand. Shown as a 4-card grid.',
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

    // ── Founders ─────────────────────────────────────────────────
    defineField({ name: 'showFounders', title: 'Show Founders Section', type: 'boolean', group: 'founders', initialValue: true }),
    defineField({ name: 'foundersHeadline_en', title: 'Founders Section Headline (English)', type: 'string', group: 'founders', initialValue: 'Meet The Founders', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'foundersHeadline_ar', title: 'عنوان قسم المؤسسين (Arabic)', type: 'string', group: 'founders', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'foundersName', title: 'Founders Names', type: 'string', group: 'founders', initialValue: 'Satish & Suresh', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'foundersRole_en', title: 'Founders Role / Title (English)', type: 'string', group: 'founders', initialValue: 'Co-Founders, Elyssa Perfumes', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'foundersRole_ar', title: 'دور المؤسسين (Arabic)', type: 'string', group: 'founders', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'foundersStory_en', title: 'Founders Story (English)', type: 'text', rows: 6, group: 'founders', description: 'A personal story about the founders — who they are, why they started.', validation: (Rule) => Rule.max(1000) }),
    defineField({ name: 'foundersStory_ar', title: 'قصة المؤسسين (Arabic)', type: 'text', rows: 6, group: 'founders', validation: (Rule) => Rule.max(1000) }),
    defineField({
      name: 'foundersImage',
      title: 'Founders Photo',
      type: 'image',
      group: 'founders',
      description: 'Professional photo of Satish & Suresh. Displayed alongside the founder story.',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),

    // ── Behind The Bottle ────────────────────────────────────────
    defineField({ name: 'showBehindBottle', title: 'Show Behind The Bottle Section', type: 'boolean', group: 'gallery', initialValue: true }),
    defineField({ name: 'behindBottleHeadline_en', title: '"Behind The Bottle" Section Headline (English)', type: 'string', group: 'gallery', initialValue: 'Behind The Bottle', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'behindBottleHeadline_ar', title: 'عنوان قسم الصور (Arabic)', type: 'string', group: 'gallery', validation: (Rule) => Rule.max(100) }),
    defineField({
      name: 'behindBottleImages',
      title: 'Process Gallery Images',
      type: 'array',
      group: 'gallery',
      description: 'Show fragrance oils, blending process, bottle filling, quality checks, and packaging. Up to 8 images. First image is shown larger.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })] }),
            defineField({ name: 'caption_en', title: 'Caption (English)', type: 'string', validation: (Rule) => Rule.max(80) }),
            defineField({ name: 'caption_ar', title: 'التسمية (Arabic)', type: 'string', validation: (Rule) => Rule.max(80) }),
          ],
          preview: { select: { media: 'image', title: 'caption_en' } },
        }),
      ],
      validation: (Rule) => Rule.max(8),
    }),

    // ── Closing Statement ────────────────────────────────────────
    defineField({ name: 'showClosing', title: 'Show Closing Statement Section', type: 'boolean', group: 'closing', initialValue: true }),
    defineField({ name: 'closingTitle_en', title: 'Closing Quote Title (English)', type: 'string', group: 'closing', initialValue: 'Every Fragrance Has A Story', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'closingTitle_ar', title: 'عنوان الاقتباس الختامي (Arabic)', type: 'string', group: 'closing', validation: (Rule) => Rule.max(100) }),
    defineField({
      name: 'closingStatement_en',
      title: 'Closing Statement Body (English)',
      type: 'text',
      rows: 3,
      group: 'closing',
      initialValue: "For more than 20 years, we've helped customers discover scents they love. Today, through Custom Scents, we're bringing that same passion into every bottle we create.",
      validation: (Rule) => Rule.max(400),
    }),
    defineField({ name: 'closingStatement_ar', title: 'نص الختام (Arabic)', type: 'text', rows: 3, group: 'closing', validation: (Rule) => Rule.max(400) }),
    defineField({ name: 'ctaHeadline_en', title: 'CTA Headline (English)', type: 'string', group: 'closing', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'ctaHeadline_ar', title: 'عنوان الدعوة (Arabic)', type: 'string', group: 'closing', validation: (Rule) => Rule.max(100) }),
    defineField({ name: 'ctaBody_en', title: 'CTA Body Text (English)', type: 'text', rows: 3, group: 'closing', validation: (Rule) => Rule.max(400) }),
    defineField({ name: 'ctaBody_ar', title: 'نص الدعوة (Arabic)', type: 'text', rows: 3, group: 'closing', validation: (Rule) => Rule.max(400) }),
    defineField({ name: 'ctaPrimary', title: 'Primary CTA Button', type: 'ctaButton', group: 'closing' }),
    defineField({ name: 'ctaSecondary', title: 'Secondary CTA Button', type: 'ctaButton', group: 'closing' }),

    // ── PageBuilder ──────────────────────────────────────────────
    defineField({
      name: 'sections',
      title: 'Extra Page Sections',
      group: 'pageBuilder',
      type: 'array',
      description: 'Add extra sections below the About content. Add a "Testimonials" section here to show customer reviews.',
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

    // ── SEO ──────────────────────────────────────────────────────
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
