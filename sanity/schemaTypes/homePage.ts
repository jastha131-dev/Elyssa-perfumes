import React from 'react'
import { defineField, defineType, defineArrayMember } from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'featured', title: 'Featured Products' },
    { name: 'scent', title: 'Scent Banner' },
    { name: 'brand', title: 'Brand Story' },
    { name: 'newsletter', title: 'Newsletter' },
  ],
  fields: [
    // ─── Hero ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
      description: 'Main headline displayed over the hero media.',
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
      group: 'hero',
      rows: 3,
      description: 'Supporting copy beneath the hero title.',
      validation: (Rule) => Rule.max(250),
    }),
    defineField({
      name: 'heroCta',
      title: 'Hero CTA',
      type: 'object',
      group: 'hero',
      description: 'Primary call-to-action button displayed in the hero.',
      fields: [
        defineField({
          name: 'label',
          title: 'Button Label',
          type: 'string',
          validation: (Rule) => Rule.max(40),
        }),
        defineField({
          name: 'href',
          title: 'Link URL',
          type: 'string',
          description: 'Relative path (e.g. /collections/all) or absolute URL.',
        }),
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      description: 'Displayed as a full-bleed background on desktop (and fallback when no video).',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.required().max(120),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroVideo',
      title: 'Hero Video (optional)',
      type: 'object',
      group: 'hero',
      description:
        'Auto-plays muted in the hero background on desktop. The hero image is used as a poster frame.',
      fields: [
        defineField({
          name: 'url',
          title: 'Video URL',
          type: 'url',
          description: 'Direct URL to an MP4 file or a hosted video CDN link.',
          validation: (Rule) =>
            Rule.uri({ scheme: ['http', 'https'] }),
        }),
        defineField({
          name: 'muxPlaybackId',
          title: 'Mux Playback ID',
          type: 'string',
          description: 'Alternative: Mux.com playback ID if using Mux for video delivery.',
        }),
      ],
    }),

    // ─── Featured Products ────────────────────────────────────────────────────
    defineField({
      name: 'featuredCollection',
      title: 'Featured Collection',
      type: 'object',
      group: 'featured',
      fields: [
        defineField({
          name: 'title',
          title: 'Section Title',
          type: 'string',
          description: 'Heading above the featured products grid.',
          validation: (Rule) => Rule.max(80),
        }),
        defineField({
          name: 'subtitle',
          title: 'Section Subtitle',
          type: 'text',
          rows: 2,
          description: 'Optional supporting text beneath the section title.',
          validation: (Rule) => Rule.max(200),
        }),
      ],
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'array',
      group: 'featured',
      description: 'Select up to 8 products to highlight on the homepage.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'product' }],
        }),
      ],
      validation: (Rule) => Rule.max(8).unique(),
    }),

    // ─── Scent Banner ─────────────────────────────────────────────────────────
    defineField({
      name: 'scentBannerImage',
      title: 'Scent Banner Background Image',
      type: 'image',
      group: 'scent',
      options: { hotspot: true },
      description: 'Background image for the "Every Scent Tells A Story" section.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
      ],
    }),
    defineField({
      name: 'scentBannerEyebrow',
      title: 'Scent Banner Eyebrow Label',
      type: 'string',
      group: 'scent',
      description: 'Small label above the headline (e.g. "Explore by Note").',
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: 'scentBannerTitle',
      title: 'Scent Banner Title',
      type: 'string',
      group: 'scent',
      description: 'Main headline for the "Every Scent Tells A Story" section.',
      validation: (Rule) => Rule.max(80),
    }),
    defineField({
      name: 'scentBannerHighlight',
      title: 'Scent Banner Highlighted Word',
      type: 'string',
      group: 'scent',
      description: 'The italic gold word in the headline (e.g. "A Story").',
      validation: (Rule) => Rule.max(40),
    }),
    defineField({
      name: 'scentBannerText',
      title: 'Scent Banner Text',
      type: 'text',
      group: 'scent',
      rows: 3,
      description: 'Supporting paragraph beneath the headline.',
      validation: (Rule) => Rule.max(300),
    }),

    // ─── Brand Story ──────────────────────────────────────────────────────────
    defineField({
      name: 'brandStoryTitle',
      title: 'Brand Story Title',
      type: 'string',
      group: 'brand',
      description: 'Headline for the brand story / about section.',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'brandStoryEyebrow',
      title: 'Brand Story Eyebrow Label',
      type: 'string',
      group: 'brand',
      description: 'Small label above the brand story headline (e.g. "Our Philosophy").',
      validation: (Rule) => Rule.max(50),
    }),
    defineField({
      name: 'brandStoryText',
      title: 'Brand Story Text',
      type: 'text',
      group: 'brand',
      rows: 6,
      description: 'The narrative body copy of the brand story section.',
      validation: (Rule) => Rule.max(1000),
    }),
    defineField({
      name: 'brandStoryImage',
      title: 'Brand Story Image',
      type: 'image',
      group: 'brand',
      options: { hotspot: true },
      description: 'Supporting image displayed alongside the brand story text.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
      ],
    }),
    defineField({
      name: 'brandStoryCta',
      title: 'Brand Story CTA',
      type: 'object',
      group: 'brand',
      description: 'Optional link to the full About page.',
      fields: [
        defineField({
          name: 'label',
          title: 'Button Label',
          type: 'string',
          validation: (Rule) => Rule.max(40),
        }),
        defineField({
          name: 'href',
          title: 'Link URL',
          type: 'string',
        }),
      ],
    }),

    // ─── Newsletter ───────────────────────────────────────────────────────────
    defineField({
      name: 'newsletterTitle',
      title: 'Newsletter Section Title',
      type: 'string',
      group: 'newsletter',
      description: 'Headline for the email signup section.',
      validation: (Rule) => Rule.max(100),
    }),
    defineField({
      name: 'newsletterSubtitle',
      title: 'Newsletter Subtitle',
      type: 'text',
      group: 'newsletter',
      rows: 2,
      description: 'Incentive copy shown beneath the newsletter title (e.g. "10% off your first order").',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'newsletterBackgroundImage',
      title: 'Newsletter Background Image',
      type: 'image',
      group: 'newsletter',
      options: { hotspot: true },
      description: 'Optional full-bleed background image for the newsletter band.',
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) => Rule.max(120),
        }),
      ],
    }),
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preview: {
    select: {
      title: 'heroTitle',
      media: 'heroImage',
    },
    prepare(val: any) {
      return {
        title: val.title ?? 'Home Page',
        subtitle: 'Singleton document',
        media: val.media,
      }
    },
  } as any,
})
